const multer=require('multer');
const path=require('path');

// Use memoryStorage to handle files as buffers
const storage = multer.memoryStorage();

//file filter to accept only images

const fileFilter=(req,file,cb)=>{
    if(file.mimetype.startsWith("image/"))
    {
        cb(null,true);
    }
    else{
        cb(new Error("only images are allowed"),false);
    }
};

const upload=multer({storage,fileFilter});
module.exports=upload;