# API d'Authentification d'Utilisateur

## Description
Cette API permet l'inscription et la connexion des utilisateurs en utilisant Node.js et MongoDB. Elle utilise les modules npm suivants : `express`, `cookie-parser`, `mongoose`, `jsonwebtoken`, `bcrypt`, et `nodemon`, `dotenv`.

## Installation
1. Clonez le dépôt : `git clone <URL_du_dépôt>`
2. Installez les dépendances : `npm install`
3. Configurez les variables d'environnement dans un fichier `.env`

## Configuration
Assurez-vous de configurer correctement les variables d'environnement nécessaires :
- `MONGO_URI`: URL de connexion à la base de données MongoDB
- `SECRET_KEY`: Clé secrète pour la génération de tokens JWT
- Autres configurations nécessaires pour votre application

## Utilisation
- Pour démarrer l'API : `npm start` ou `nodemon`
- Les endpoints principaux :
  - `POST /api/register`: Endpoint pour l'inscription d'un nouvel utilisateur
  - `POST /api/login`: Endpoint pour la connexion d'un utilisateur existant
  - `PUT /api/users/:userId`: Endpoint pour la mise à jour du profil utilisateur
  - `DELETE /api/users/:userId`: Endpoint pour la suppression du compte utilisateur
  - `POST /api/upload`: Endpoint pour le téléchargement d'images d'animaux
  - `POST /api/send-message`: Endpoint pour envoyer un message à tous les utilisateurs connectés
  - `POST /api/comments/:animalId`: Endpoint pour ajouter un commentaire à une annonce d'animal
  - `GET /api/comments/:animalId`: Endpoint pour récupérer les commentaires d'une annonce d'animal
  - `POST /api/likes/:animalId`: Endpoint pour ajouter un like à une annonce d'animal
  - `GET /api/likes/:animalId`: Endpoint pour récupérer les likes d'une annonce d'animal
  - `POST /api/subscriptions/:userId`: Endpoint pour s'abonner à un utilisateur
  - `GET /api/subscriptions/:userId`: Endpoint pour récupérer les abonnements d'un utilisateur

## Contribuer
Vous pouvez contribuer à ce projet en créant des issues, en soumettant des pull requests, etc.

## Auteurs
- Votre nom ou pseudo

## License
Ce projet est sous licence [insérer la licence]

## Remarques supplémentaires
Ajoutez ici toute remarque ou détails supplémentaires que vous jugez importants pour votre API.
