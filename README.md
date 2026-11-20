# Pollution Tracker

| Dossier | Contenu |
|---|---|
| `api/` | API REST Node.js / Express / Sequelize / PostgreSQL |
| `front/pollution/` | Application Angular |
| `render.yaml` | Déploiement Render (base PostgreSQL, API, front) |

## API

```bash
cd api
npm install
npm run dev     # http://localhost:3000
```

Variables d'environnement : `DATABASE_URL` (par défaut `postgres://postgres:postgres@localhost:5432/pollution_db`) et `PORT` (par défaut `3000`).
Au démarrage, les tables `pollution` et `users` sont créées si besoin, et `pollution` est remplie avec des exemples si elle est vide.

| Route | Description |
|---|---|
| `GET /health` | État du service |
| `POST /api/users` | Créer un utilisateur (mot de passe haché, jamais renvoyé) |
| `GET /api/users` | Liste des utilisateurs |
| `POST /api/login` | Connexion fictive (renvoie l'utilisateur, ou 401) |
| `GET /api/pollutions` | Liste des pollutions |
| `GET /api/pollutions/:id` | Détail d'une pollution |
| `GET /api/pollutions/:id/photo` | Photo de la pollution (image stockée en base) |
| `POST /api/pollutions` | Ajouter une pollution |
| `PUT /api/pollutions/:id` | Modifier une pollution (`removePhoto: true` pour supprimer la photo) |
| `DELETE /api/pollutions/:id` | Supprimer une pollution |

`POST` et `PUT` acceptent du JSON, ou du `multipart/form-data` avec les champs en JSON dans `data` et une image optionnelle dans `photo` (JPEG, PNG, WebP ou GIF, 5 Mo max). Les réponses contiennent `photoUrl`, l'adresse de la photo, ou `null`.

Organisation : `routes` (URL) → `controllers` (HTTP uniquement) → `services` (logique métier) → `models` (Sequelize). Les erreurs levées par les services sont converties en réponses HTTP dans `middlewares/error.middleware.ts`.

Erreurs renvoyées en JSON (`{ "message": ... }`) : 400 données invalides, 404 introuvable, 401 identifiants incorrects, 409 identifiant ou e-mail déjà utilisé, 413 photo trop lourde, 500 erreur serveur.

## Front

```bash
cd front/pollution
npm install
npm start       # http://localhost:4200
```

En dev, les appels sont servis par une API simulée (`useMockApi` dans `src/environments/environment.development.ts`). Mettre `false` pour appeler l'API locale.

## Déploiement

Sur Render : **New → Blueprint**, puis choisir ce dépôt. `render.yaml` crée la base, l'API et le front. Au build du front, `set-env.js` fait pointer `environment.ts` vers l'URL de l'API déployée.

Test : `curl https://<pollution-api>.onrender.com/api/pollutions`
