import esxpress from 'express';
import router from esxpress.Router();
import { upload } from '../middlewaers/multer.js';
import {publishAVideo} from '../controllers/vedio.controllers.js';

router.route('/publishvedio').post(upload.fields([
    {
           name:"vedio",
           maxCount:1,
    },
     {
           name:"tumbnail",
           maxCount:1,
    },
]),publishAVideo)



export default router;