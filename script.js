// Field definitions: id + human-readable label for the summary
const FIELDS = [
  { id: 'login', label: 'Login' },
  { id: 'password', label: 'Mot de passe' },
  { id: 'confirmPassword', label: 'Confirmation du mot de passe' },
  { id: 'lastName', label: 'Nom' },
  { id: 'firstName', label: 'Prénom' },
  { id: 'address', label: 'Adresse' },
  { id: 'email', label: 'Email' },
  { id: 'phone', label: 'Téléphone' },
  { id: 'birthDate', label: 'Date de naissance' }
];

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// Accepts French numbers starting with 0 or +33, followed by 9 digits
// (spaces, dots or dashes between groups are tolerated)
const PHONE_REGEX = /^(0|\+33)[1-9](\d{2}){4}$/;

/**
 * Reads all form field values into a plain object keyed by field id.
 */
function getFormValues() {
  const values = {};
  FIELDS.forEach(field => {
    values[field.id] = document.getElementById(field.id).value.trim();
  });
  return values;
}

/**
 * Checks that every required field has a non-empty value.
 */
function areAllFieldsFilled(values) {
  return FIELDS.every(field => values[field.id] !== '');
}

/**
 * Validates the email format.
 */
function isEmailValid(email) {
  return EMAIL_REGEX.test(email);
}

/**
 * Validates the phone number format (digits only, separators stripped).
 */
function isPhoneValid(phone) {
  const digitsOnly = phone.replace(/[\s.-]/g, '');
  return PHONE_REGEX.test(digitsOnly);
}

/**
 * Checks that the birth date is not in the future.
 */
function isBirthDateValid(birthDate) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return new Date(birthDate) <= today;
}

/**
 * Checks that the password and its confirmation match.
 */
function doPasswordsMatch(password, confirmPassword) {
  return password === confirmPassword;
}

/**
 * Runs all validation rules and returns the first error message found,
 * or null if the data is valid.
 */
function validateFormValues(values) {
  if (!areAllFieldsFilled(values)) {
    return 'Veuillez remplir tous les champs.';
  }
  if (!isEmailValid(values.email)) {
    return 'Veuillez saisir une adresse email valide.';
  }
  if (!isPhoneValid(values.phone)) {
    return 'Veuillez saisir un numéro de téléphone valide.';
  }
  if (!isBirthDateValid(values.birthDate)) {
    return 'La date de naissance ne peut pas être une date future.';
  }
  if (!doPasswordsMatch(values.password, values.confirmPassword)) {
    return 'Les mots de passe ne correspondent pas.';
  }
  return null;
}

/**
 * Displays an error message in the form.
 */
function showError(message) {
  document.getElementById('errorMessage').textContent = message;
}

/**
 * Clears any currently displayed error message.
 */
function clearError() {
  showError('');
}

/**
 * Builds the summary content from the form values (password excluded)
 * and renders it into the summary list.
 */
function renderSummary(values) {
  const summaryList = document.getElementById('summaryList');
  summaryList.innerHTML = '';

  FIELDS
    .filter(field => field.id !== 'password' && field.id !== 'confirmPassword')
    .forEach(field => {
      const term = document.createElement('dt');
      term.textContent = field.label;

      const description = document.createElement('dd');
      description.textContent = values[field.id];

      summaryList.appendChild(term);
      summaryList.appendChild(description);
    });
}

/**
 * Switches the visible section from the form to the summary, or back.
 */
function toggleSections(showSummary) {
  document.getElementById('registerSection').classList.toggle('hidden', showSummary);
  document.getElementById('summarySection').classList.toggle('hidden', !showSummary);
}

/**
 * Handles the form submission: validates input and either shows an
 * error or displays the summary page.
 */
function handleFormSubmit(event) {
  event.preventDefault();

  const values = getFormValues();
  const errorMessage = validateFormValues(values);

  if (errorMessage) {
    showError(errorMessage);
    return;
  }

  clearError();
  renderSummary(values);
  toggleSections(true);
}

/**
 * Resets the form and returns to the registration view.
 */
function handleBackButtonClick() {
  document.getElementById('registerForm').reset();
  clearError();
  toggleSections(false);
}

document.getElementById('birthDate').max = new Date().toISOString().split('T')[0];
document.getElementById('registerForm').addEventListener('submit', handleFormSubmit);
document.getElementById('backButton').addEventListener('click', handleBackButtonClick);
