// Dans le fichier socket.js
const socketIo = require('socket.io');

let io;

const initSocketIO = (server) => {
  io = socketIo(server);

  io.on('connection', (socket) => {
    console.log('Utilisateur connecté', socket.id);

    // Gérer la connexion d'un utilisateur spécifique
    socket.on('join', (userId) => {
      socket.join(userId);
    });

    // Gérer l'envoi de messages privés
    socket.on('privateMessage', async ({ senderId, receiverId, message }) => {
      // Vérifier si le destinataire est connecté
      const isReceiverConnected = io.sockets.adapter.rooms.has(receiverId);

      if (isReceiverConnected) {
        // Envoyer le message uniquement au destinataire
        io.to(receiverId).emit('privateMessage', { senderId, message, status: 'delivered' });

        // Mettre à jour la base de données avec l'état de livraison
        // (par exemple, enregistrer dans la base de données que le message est "livré")
        // ...

        // Attendre un certain temps (par exemple, 2 secondes) pour simuler la lecture
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Envoyer la confirmation de lecture
        io.to(receiverId).emit('privateMessage', { senderId, status: 'read' });

        // Mettre à jour la base de données avec l'état de lecture
        // (par exemple, enregistrer dans la base de données que le message est "lu")
        // ...
      } else {
        // Gérer le cas où le destinataire n'est pas connecté
        console.log(`L'utilisateur ${receiverId} n'est pas connecté.`);
      }
    });

    // Gérer la déconnexion des utilisateurs
    socket.on('disconnect', () => {
      console.log('Utilisateur déconnecté', socket.id);
    });
  });
};

const sendMessageToAllClients = (data) => {
  io.emit('message', data);
};

module.exports = { initSocketIO, sendMessageToAllClients };
