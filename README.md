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
| `GET /api/pollutions` | Liste des pollutions |
| `GET /api/pollutions/:id` | Détail d'une pollution |
| `POST /api/pollutions` | Ajouter une pollution |
| `PUT /api/pollutions/:id` | Modifier une pollution |
| `DELETE /api/pollutions/:id` | Supprimer une pollution |

Erreurs renvoyées en JSON (`{ "message": ... }`) : 400 données invalides, 404 introuvable, 409 identifiant ou e-mail déjà utilisé, 500 erreur serveur.

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
