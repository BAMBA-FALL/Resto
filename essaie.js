const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const bodyParser = require('body-parser');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const csurf = require('csurf');  
const connectDB = require('./config/conn');
const dotenv = require('dotenv').config();
const { initSocketIO } = require('./socket_io/socket');
const userRoutes = require('./router/userRoutes');
const annonceRoutes = require('./router/annonceRoutes');  // Ajout des routes annonces
const commentRoutes = require('./router/commentRoutes');  // Ajout des routes commentaires
const likeRoutes = require('./router/likeRoutes');  // Ajout des routes likes
const subscriptionRoutes = require('./router/subscriptionRoutes')
const animalRoutes = require('./router/animalRoutes');  // Ajout des routes animaux
const messagingRoutes = require('./router/MessageRoutes');  // Ajout des routes messagerie

// Connexion avec la base de données
connectDB();

// Création de l'application Express
const app = express();
const server = http.createServer(app);

// Utilisez csurf après cookie-parser
app.use(cookieParser());
app.use(csurf({ cookie: true }));

// Gestion des erreurs CSRF
app.use((err, req, res, next) => {
  if (err.code === 'EBADCSRFTOKEN') {
    return res.status(403).json({ message: 'Invalid CSRF token' });
  }
  next(err);
});

// Utiliser body-parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Middleware CORS
const corsOptions = {
  origin: 'http://localhost:3000',
  methods: 'GET,PUT,POST,DELETE',
  optionsSuccessStatus: 200,
  credentials: true,
  allowedHeaders: 'Origin, X-Requested-With, x-access-token, role, Content, Accept, Content-Type, Authorization',
};
app.use(cors(corsOptions));

// Routes pour l'authentification des utilisateurs
app.use('/api', userRoutes);

// Nouvelles routes pour les annonces
app.use('/api', annonceRoutes);

// Nouvelles routes pour les commentaires
app.use('/api', commentRoutes);

// Nouvelles routes pour les likes
app.use('/api', likeRoutes);

//Nouvelles routes pour les likes
app.use('/api',subscriptionRoutes)

// Routes pour l'authentification
app.use('/api', animalRoutes);

// Nouvelles routes pour la messagerie en temps réel avec Socket.IO
app.use('/messaging', messagingRoutes);

// ... autres configurations et routes

// Écoute du serveur
const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(`Server is listening at http://localhost:${PORT}`);
});

// Initialisation de Socket.IO
const io = socketIO(server);
initSocketIO(io);
