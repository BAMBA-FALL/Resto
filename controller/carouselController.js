const Carousel = require('../model/carouselModel')



const getAllCarousels = async (req, res) => {
    try {
    //   const user = req.user.id; 
      const { title, description } = req.body;

      // Créer un nouveau carousel en associant l'ID de l'utilisateur
      const newCarousel = new Carousel({
        images: req.files.map(file => file.filename),
        // user: user,
        title: title,
        description: description
        // Autres champs du carousel (title, description, etc.)
      });
  
      // Enregistrer le carousel dans la base de données
      await newCarousel.save();
  
      res.status(201).json({ message: 'Carousel créé avec succès' });
    } catch (error) {
      console.error('Erreur lors de la création du carousel :', error);
      res.status(500).json({ message: 'Erreur lors de la création du carousel' });
    }
}

const addCarousel = async(req,res)=> {

try {

  const {title, description} = req.body; 


  const newCarousel = new Carousel({
    title: title, 
    description
  })
  

  await Carousel.save();

  return res.statue(200).json({message: 'Le carousel a été ajouté avec succès'})
} catch (error) {

  return res.status(400).json({message:'il une erreur lors de la création du carousel'})
  
}

}


module.exports = {
    getAllCarousels,
    addCarousel
}