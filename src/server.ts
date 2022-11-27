import express from 'express';
import bodyParser from 'body-parser';
import {filterImageFromURL, deleteLocalFiles, isValidImageUrl} from './util/util';

(async () => {

  // Init the Express application
  const app = express();

  // Set the network port
  const port = process.env.PORT || 8082;
  
  // Use the body parser middleware for post requests
  app.use(bodyParser.json());

  // Root Endpoint
  // Displays a simple message to the user
  app.get( "/", async ( req, res ) => {
    res.send("try GET /filteredimage?image_url={{}}")
  } );

  //Filters Image and returns back filtered image result
  app.get( "/filteredimage", async ( req, res ) => {
    const imageUrl : string = req.query.image_url;
    const _isValidImageUrl : boolean = isValidImageUrl(imageUrl);

    if (_isValidImageUrl) {
      try {
        const filteredImagePath : string = await filterImageFromURL(imageUrl.trim());
        res.sendFile(filteredImagePath, () => {
          return deleteLocalFiles([filteredImagePath]);
        })
      } catch(err) {
        if (err instanceof Error) {
          return res.status(500).send({ message: err.message }); 
        }
        return res.status(500).send({ message: err }); 
      }
    } else {
      return res.status(400).send({ message: 'Not valid image_url' });
    }
  });
  

  // Start the Server
  app.listen( port, () => {
      console.log( `server running http://localhost:${ port }` );
      console.log( `press CTRL+C to stop server` );
  } );
})();