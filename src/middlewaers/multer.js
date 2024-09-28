import multer from "multer";

const storage=multer.diskStorage({
    destination: function(req, file, cb){
        cb(null,"./public/temp")
    },
    filename: function (req,file,cb){
         const uniqueSuffix=Date.now() + '_' + Math.round
        // (Math.random() * 1E9)CLOUDINARY_URL=cloudinary://924587253273425:ovsGfzBe8zrAueAKeFqYQuOVyUA@uploadfilecloud
        cb(null,file.originalname +uniqueSuffix)    
    }

})

export const upload=multer({stotage:storage})