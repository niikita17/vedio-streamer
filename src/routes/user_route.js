import esxpress from 'express';
import router from esxpress.Router();
import { upload } from '../middlewaers/multer.js';
import {registerUser} from '../controllers/user_controller.js';

router.route('/register').post(upload.fields([
    {
           name:"Avatar",
           maxCount:1,
    },
    {
        name:coverImage,
        maxCount:1,
    }
]),registerUser)



export default router;