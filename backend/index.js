require('dotenv').config();

const mongoose=require('mongoose');
const bcrypt=require('bcrypt');
const express=require('express');
const cors=require('cors');
const jwt =require('jsonwebtoken');

const upload=require('./multer');
const fs=require('fs');
const path=require('path');
const cloudinary = require('./cloudinaryConfig');

const User=require("./models/user.model");
const TravelStory=require("./models/travelStory.model");

const { authenticateToken } = require('./utilities.js');
const { error } = require('console');

mongoose.connect(process.env.MONGO_CONNECTION_STRING);

const db = mongoose.connection;

db.on('connected', () => {
    console.log('✅ MongoDB connection successful!');
});

db.on('error', (err) => {
    console.error('❌ MongoDB connection error:', err);
});

const app=express();
app.use(express.json());
app.use(cors({origin:"*"}));

app.post("/create-account",async(req,res)=>{
   
    const {fullName,email,password}=req.body;

    if(!fullName || !email || !password)
    {
        return res.status(400)
        .json({error:true,message:"All fields are required"});
    }

    const isUser=await User.findOne({email});
    if(isUser)
    {
        return res
        .status(400)
        .json({error:true,message:'user already exits'});
    }

    const hashesPassword=await bcrypt.hash(password,10);

    const user=new User({
        fullName,
        email,
        password:hashesPassword,
    });

    await user.save();

    const accessToken=jwt.sign(
        {userId:user._id},
        process.env.ACCESS_TOKEN_SECRET || 'defaultSecretKey',
        {
            expiresIn:"72h",
        }
    );
   
    return res.status(201).json({
        error:false,
        user:{fullName:user.fullName,email:user.email},
        accessToken,
        message:"Registration Successful",
    });
});

//login
app.post("/login",async(req,res)=>{
    const {email,password}=req.body;

    if(!email || !password)
    {
        return res.status(400).json({message:"email and password are required field"});
    }
    // const user=await User.find({email});
    // if(!user)
    // {
    //     return res.status(400).json({message:"user is not defined"});
    // }

    const user = await User.findOne({email});

    if(!user){
        return res.status(400).json({message:"user not found"});}

    const isPasswordValid=await bcrypt.compare(password,user.password);

    if(!isPasswordValid)
    {
        return res.status(400).json({meassge:"Invalid credentials"});
    }
    const accessToken = jwt.sign(
        { userId: user._id },
        process.env.ACCESS_TOKEN_SECRET || 'defaultSecretKey',
        {
            expiresIn: "72h",
        }
    );

    return res.status(201).json({
        error: false,
        user: { fullName: user.fullName, email: user.email },
        accessToken,
        message: "Login Successful",
    });


})

app.get("/get-user",authenticateToken,async(req,res)=>{
    const {userId} = req.user;

    const isUser=await User.findOne({_id:userId});

    if(!isUser){
        return res.sendStatus(401); 
    }

    return res.json({
        user:isUser,
        message:"",
});
});

app.post("/add-travel-story", authenticateToken, async (req, res) => {
    const { title, story, visitedLocation, imageUrl, visitedDate } = req.body;
    const { userId } = req.user;

    console.log(`[+] Received request to add story for user: ${userId}`);
    console.log(`  > Title: ${title}`);

    if (!title) {
        return res.status(400).json({ error: true, message: "Title is required." });
    }
    if (!story) {
        return res.status(400).json({ error: true, message: "Story is required." });
    }
    if (!visitedDate) {
        return res.status(400).json({ error: true, message: "Visited Date is required." });
    }
    // imageUrl is not strictly required to add a story, but we check if it's a valid string if provided
    if (imageUrl && typeof imageUrl !== 'string') {
        return res.status(400).json({ error: true, message: "Invalid Image URL." });
    }

    try {
        const travelStory = new TravelStory({
            title,
            story,
            visitedLocation: visitedLocation || [],
            userId,
            imageUrl: imageUrl || "", // Use provided imageUrl or an empty string
            visitedDate: new Date(parseInt(visitedDate)), // Ensure date is parsed correctly
        });

        await travelStory.save();
        
        console.log(`  > Story saved successfully with ID: ${travelStory._id}`);
        
        return res.status(201).json({
            error: false,
            story: travelStory,
            message: "Travel story added successfully.",
        });

    } catch (error) {
        console.error(`  > Error saving story: ${error.message}`);
        return res.status(500).json({
            error: true,
            message: "An internal server error occurred.",
        });
    }
});

app.get("/get-all-travel-stories",authenticateToken,async(req,res)=>{
    const {userId}=req.user;
    try{
        const travelStories=await TravelStory.find({userId:userId}).sort({
            isFavourite:-1,
        });
        res.status(200).json({stories:travelStories});

    }
    catch(error)
    {
        res.status(500).json({error:true,message:error.message});
    }
})


//route to handle image upload
app.post("/image-upload", upload.single('image'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: true, message: "No image uploaded" });
        }

        // Upload image to Cloudinary from buffer
        cloudinary.uploader.upload_stream({ resource_type: 'image' }, (error, result) => {
            if (error) {
                return res.status(500).json({ error: true, message: "Image upload failed", details: error.message });
            }
            res.status(200).json({ imageUrl: result.secure_url });
        }).end(req.file.buffer);

    } catch (error) {
        res.status(500).json({ error: true, message: error.message });
    }
});

//delete the image
app.delete("/delete-image",async(req,res)=>{
    const {imageUrl}=req.query;

    if(!imageUrl)
    {
        return res.status(400).json({error:true,message:"imageUrl parameter is the required filed"});
    }

    try{
        //extract the filename from the image url
        const filename=path.basename(imageUrl);

        //define the file path
        const filePath=path.join(__dirname,'uploads',filename);

        if(fs.existsSync(filePath))
        {
            //delete the file from the uploads folder
            fs.unlinkSync(filePath);
            res.status(200).json({message:"Image deleted successfully"});
        }
        else{
            res.status(300).json({error:true,message:"Image not found"});
        }
        
    }
    catch(error)
    {
        res.status(500).json({error:true,message:error.message});
    }
})
//edit travel story

app.put("/edit-story/:id",authenticateToken,async(req,res)=>{
    const {id}=req.params;
    const {title,story,visitedLocation,imageUrl,visitedDate}=req.body;
    const {userId}=req.user;

    if(!title || !story || !visitedDate ||!visitedLocation)
        {
            return res.status(400).json({error:true,message:"all the fields are required"});
        }
    
        const parsedVisitedDate=new Date(parseInt(visitedDate));
   try{
    const travelStory=await TravelStory.findOne({_id:id,userId:userId});

    if(!travelStory)
    {
        return res.status(404).json({error:true,message:"Travel story not found"});
    }
    const placehoilderImgUrl=`http://localhost:8000/assets/images.png`;

    travelStory.title=title;
    travelStory.story=story;
    travelStory.visitedDate=parsedVisitedDate;
    travelStory.visitedLocation=visitedLocation;
    travelStory.imageUrl=imageUrl || placehoilderImgUrl;

    await travelStory.save();
    res.status(200).json({story:travelStory,message:"updated successfully"});
   }
   catch(error)
   {
      res.status(500).json({error:true,message:error.meassge});
   }

})

//delete a trave story

app.delete("/delete-story/:id",authenticateToken,async(req,res)=>{
    const {id}=req.params;
    const {userId}=req.user;

    try{
        const travelStory=await TravelStory.findOne({_id:id,userId:userId});

        if(!travelStory)
        {
            return res.status(404).json({error:true,message:"Travel story not found"});
        }
        await travelStory.deleteOne({_id:id,userId:userId});

        //extract the filename from the database

        const imageUrl=travelStory.imageUrl;
        const filename=path.basename(imageUrl);

        //define the file path
        const filePath=path.join(__dirname,'uploads',filename);

        //delete the image file from the upload folder
        fs.unlink(filePath,(err)=>{
            if(err)
            {
                console.error("failed to delete image file",err);
            }
        });

        res.status(200).json({message:"Travel story deleted successfully"});
    }
    catch(error)
    {
       res.status(500).json({error:true,message:error.meassge});
    }
})

//update isfavourite

app.put("/update-is-favourite/:id",authenticateToken,async (req,res) => {

    const {id}=req.params;
    const {isFavourite}=req.body;
    const {userId}=req.user;

    try{
        const travelStory=await TravelStory.findOne({_id:id,userId:userId});

        if(!travelStory)
        {
            return res.status(404).json({error:true,message:"Travel story not found"});

           

        }
        travelStory.isFavourite=isFavourite;

        await travelStory.save();
        res.status(200).json({story:travelStory,message:"updated successfully"});
    }
    catch(error)
    {
        res.status(500).json({error:true,message:error.message});
    }
    
})

//search travel stories
app.get("/search",authenticateToken,async (req,res) => {
    const {query}=req.query;
    const {userId}=req.user;

    if(!query)
    {
        return res.status(404).json({error:true,message:"query is required"});
    }
    try{
        const searchResults=await TravelStory.find({
            userId:userId,
            $or:[
                {title:{$regex:query,$options:"i"}},
                {story:{$regex:query,$options:"i"}},
                {visitedLocation:{$regex:query,$options:"i"}},
            
            ],
        }).sort({isFavourite:-1});

        res.status(200).json({stories:searchResults});
    }
    catch(error)
    {
        res.status(500).json({error:true,message:error.message});
    }
    
})

//filter start and end date
app.get("/travel-stories/filter",authenticateToken,async(req,res)=>{
    
    const{startDate,endDate}=req.query;
    const{userId}=req.user;
    try{
        //convert startdate and enddate from milliseconds to date objects
        const start=new Date(parseInt(startDate));
        const end=new Date(parseInt(endDate));

        //find travel stories belong to that
        const filteredStories=await TravelStory.find({
            userId:userId,
            visitedDate:{$gte:start, $lte:end},
        }).sort({isFavourite:-1});

        res.status(200).json({stories:filteredStories});
    }
    catch (error) {
        res.status(400).json({error:true,message:error.message});
}
});

app.use("/uploads",express.static(path.join(__dirname,"uploads")));
app.use("/assets",express.static(path.join(__dirname,"assets")));

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`);
});

module.exports=app;






