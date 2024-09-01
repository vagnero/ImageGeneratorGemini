import {Router} from 'express';
import { imageCache } from '../cache/imageCache';
const measureRouter = Router();

import MeasureController from '../controllers/MeasureController';
const controller = new MeasureController();
measureRouter.post("/upload" ,controller.create);
measureRouter.patch("/confirm", controller.update);
measureRouter.get('/:customer_code/list',controller.getMeasures);

measureRouter.get('/image/:id', (req, res) => {
  const imageId = req.params.id;
  const imageBuffer = imageCache.get(imageId);

  if (imageBuffer) {
    res.writeHead(200, {
      'Content-Type': 'image/png',
      'Content-Length': imageBuffer.length
    });
    res.end(imageBuffer);
  } else {
    res.status(404).json({ error: 'Imagem não encontrada ou expirada' });
  }
});

export default measureRouter;