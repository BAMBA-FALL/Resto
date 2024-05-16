const multer = require('multer');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  },
});

const upload = multer({ storage: storage });

module.exports = upload;





// const MIME_TYPES = {
//   'image/jpg': 'jpg',
//   'image/jpeg': 'jpg',
//   'image/png': 'png'
// };

// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, 'uploads/');
//   },
//   filename: (req, file, cb) => {
//     const name = file.originalname.split(' ').join('_');
//     const extension = MIME_TYPES[file.mimetype];
//     cb(null, name + Date.now() + '.' + extension);
//   }
// });


// const upload = multer({ storage: storage });

// module.exports = upload;



// const multer = require('multer');
// const MIME_TYPES = {
//   'image/jpg': 'jpg',
//   'image/jpeg': 'jpg',
//   'image/png': 'png'
// };


// const storage = multer.diskStorage({
//   destination: (req, file, callback) => {
//     callback(null, 'uploads/'); 
//   },
//   filename: (req, file, callback) => {
//     const name = file.originalname.split(' ').join('_'); 
//     const extension = MIME_TYPES[file.mimetype];
//     callback(null, name + Date.now() + '.' + extension); 
//   }
// });


// const upload = multer({ storage: storage });

// module.exports = upload;



// const fileFilter = (req, file, cb) => {

//   if (file.mimetype.startsWith('image/')) {
//     cb(null, true); 
//   } else {
//     cb(new Error('Le fichier doit être une image.'), false); 
//   }
// };


// const upload = multer({ 
//   storage: storage,
//   limits: {
//     fileSize: 5 * 1024 * 1024, 
//     files: 4 
//   },
//   fileFilter: fileFilter
// });

// module.exports = upload;

// const multer = require('multer');

// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, 'uploads/'); 
// },
//   filename: (req, file, cb) => {
//     cb(null, `${Date.now()}-${file.originalname}`); 
// }
// });

// const upload = multer({
//   storage: storage,
//   limits: { fileSize: 1000000000 }, 
// fileFilter: (req, file, cb) => {
//     if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
//       cb(null, true);
// } else {
//       cb(new Error('Seules les images JPEG et PNG sont autorisées.'), false);
//     }
//   }
// });

// module.exports = upload;
