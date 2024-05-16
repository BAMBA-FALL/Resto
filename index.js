const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const bodyParser = require('body-parser');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv').config();
const connectDB = require('./config/conn');
const { initSocketIO } = require('./socket_io/socket');
const userRoutes = require('./router/userRoutes');
const roleRoutes = require('./router/roleRoutes');
const permissionRoutes = require('./router/permissionRoutes');
const productRoutes = require('./router/productRoutes')
const accessoireRoutes = require('./router/accessoireRoutes')
const orderRoutes = require('./router/orderRoutes')
const cartRoutes = require('./router/cartRoutes')
const carouselRoutes = require('./router/carouselRoutes')
const categoryRoutes = require('./router/categoryRoutes')



// Connexion avec la base de données
connectDB();

// Création de l'application Express
const app = express();
app.use('/uploads', express.static('./uploads'));
const server = http.createServer(app);


// Middleware CORS
const corsOptions = {
  origin: ['http://localhost:3000', 'http://localhost:19006', ' http://localhost:3001'],
  methods: 'GET,PUT,POST,DELETE',
  optionsSuccessStatus: 200,
  credentials: true,
  allowedHeaders: 'Origin, X-Requested-With, x-access-token, role, Content, Accept, Content-Type, Authorization',
};
app.use(cors(corsOptions));

// Utilisation de cookie-parser
app.use(cookieParser());

// Utiliser body-parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes pour l'authentification des utilisateurs
app.use('/api', userRoutes);
app.use('/api', roleRoutes);
app.use('/api', permissionRoutes);
app.use('/api', productRoutes);
app.use('/api', accessoireRoutes);
app.use('/api', orderRoutes);
app.use('/api', cartRoutes);
app.use('/api',carouselRoutes);
app.use('/api',categoryRoutes);

// Écoute du serveur
const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(`Server is listening at http://localhost:${PORT}`);
});

// Initialisation de Socket.IO
const io = socketIO(server);
initSocketIO(io);
