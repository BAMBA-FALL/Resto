const userModel = require('../model/userModel');
const jwt = require('jsonwebtoken');

const isAuthenticated = async (req, res, next) => {
  try {
      const authHeader = req.headers['authorization'];

      if (!authHeader) {
          return res.status(401).json({message: 'Veuillez vous connecter pour accéder aux données'});
      }

      const token = authHeader.split(' ')[1]; 
      console.log('Token extrait:', token); 
      jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
          if (err) {
              console.error('Erreur lors de la vérification du token:', err);
              if (err.name === 'TokenExpiredError') {
                  // Gérer le cas où le jeton d'authentification a expiré
                  // Par exemple, rediriger l'utilisateur vers la page de connexion
                  return res.status(401).json({ message: 'Le jeton d\'authentification a expiré. Veuillez vous reconnecter.' });
              } else {
                  // Gérer les autres erreurs de vérification du jeton
                  return res.status(401).json({ message: 'Jeton d\'authentification non valide.' });
              }
          } else {
              req.user = decoded;
              next();
          }
      });
  } catch (error) {
      console.error('Erreur lors de l\'authentification', error);
      return res.status(500).json({ message: 'Erreur lors de l\'authentification', error: error.message });
  }
};


module.exports = isAuthenticated;






















// const isAuthenticated = async (req, res, next) => {
//   try {

//     const token = req.cookies.token;

//     if (!token) {
//       console.log('Token non trouvé');
//       return res.status(401).json({ message: 'Veuillez vous connecter pour accéder aux données' });
//     }


//     const decodedToken = jwt.verify(token, process.env.SECRET_KEY);
//     const now = new Date();

    
//     if (now > decodedToken.exp * 1000) {
//       console.log('Token expiré');
//       return res.status(401).json({ message: 'Token expiré' });
//     }


//     const user = await userModel.findById(decodedToken.id);
//     if (!user) {
//       console.log('Utilisateur non trouvé');
//       return res.status(404).json({ message: 'Utilisateur non trouvé' });
//     }

 
//     req.user = user;
//     next();
//   } catch (error) {
//     console.error('Erreur lors de l\'authentification', error);
//     return res.status(500).json({ message: 'Erreur lors de l\'authentification', error: error.message });
//   }
// };

// module.exports = isAuthenticated;




//MON PRPORE MIDDLEWARE


// const isAuthenticated = async (req, res, next) => {
//   try {

//     const token = req.cookies.token;

//     if (!token) {
//       console.log('Token non trouvé');
//       return res.status(401).json({ message: 'Veuillez vous connecter pour accéder aux données' });
//     }


//     const decodedToken = jwt.verify(token, process.env.SECRET_KEY);
//     const now = new Date();


//     if (now > decodedToken.exp * 1000) {
//       console.log('Token expiré');
//       return res.status(401).json({ message: 'Token expiré' });
//     }


//     const user = await userModel.findById(decodedToken.id);
//     if (!user) {
//       console.log('Utilisateur non trouvé');
//       return res.status(404).json({ message: 'Utilisateur non trouvé' });
//     }

//     req.user = user;
//     next();
//   } catch (error) {
//     console.error('Erreur lors de l\'authentification', error);
//     return res.status(500).json({ message: 'Erreur lors de l\'authentification', error: error.message });
//   }
// };



// const isAuthenticated = async (req, res, next) => {
//   try {
//     const token = req.cookies.token;

//     if (!token) {
//       return res.status(401).json({ message: 'Veuillez vous connecter pour accéder aux données' });
//     }

//     jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
//       if (err) {
//         if (err.name === 'TokenExpiredError') {
//           return res.status(401).json({ message: 'Le jeton d\'authentification a expiré. Veuillez vous reconnecter.' });
//         } else {
//           return res.status(401).json({ message: 'Jeton d\'authentification non valide.' });
//         }
//       } else {
//         req.user = decoded;
//         next();
//       }
//     });
//   } catch (error) {
//     console.error('Erreur lors de l\'authentification', error);
//     return res.status(500).json({ message: 'Erreur lors de l\'authentification', error: error.message });
//   }
// };

// module.exports = isAuthenticated;
