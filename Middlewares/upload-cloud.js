const {initializeApp}= require("firebase/app");
const {getStorage,ref,uploadBytesResumable,getDownloadURL} = require("firebase/storage");
const {firebaseConfig} =require("../firebase");
initializeApp(firebaseConfig);
const storage =  getStorage();

const uploadfileMIddleware=async(req,res,next)=>{
    try {
        console.log("entyerd")
        const storageRef=ref(storage,`files/${req.file.originalname}`)
         const metadata={
            contentType:req.file.mimetype,
         }
         const snapshot=await uploadBytesResumable(storageRef,req.file.buffer,metadata);
         const downloadUrl=await getDownloadURL(snapshot.ref);
         console.log("down",downloadUrl);
         if(downloadUrl)req.downloadURl=downloadUrl;
        else req.downloadURl=null;
       return next();
    } catch (error) {
        console.log(error,"from cloud ");
        return res.status(400).send(error.message);
    }
  }


  const uploadMultipleFilesMiddleware = async (req, res, next) => {
    try {
        console.log("entered");

        // Array to store promises for each upload
        const uploadPromises = [];

        // Iterate over each file in the request files array
        req.files.forEach((file) => {
            const storageRef = ref(storage, `files/${file.originalname}`);
            const metadata = {
                contentType: file.mimetype,
            };

            // Create an upload promise for each file
            const uploadPromise = uploadBytesResumable(storageRef, file.buffer, metadata)
                .then((snapshot) => getDownloadURL(snapshot.ref));

            // Push the promise to the array
            uploadPromises.push(uploadPromise);
        });

        // Wait for all upload promises to resolve
        const downloadUrls = await Promise.all(uploadPromises);
        console.log("downloadUrls", downloadUrls);

        // Attach download URLs to the request object
        req.downloadUrls = downloadUrls;

        return next();
    } catch (error) {
        console.log("Error from cloud:", error);
        return res.status(400).send(error.message);
    }
};


const uploadMultiple_Vids_MiddlewareForcourse = async (req, res, next) => {
    try {
        console.log("entered");

        // Array to store promises for each upload
        const uploadPromises = req.files.map(async (file) => {
            const storageRef = ref(storage, `files/${file.originalname}`);
            const metadata = {
                contentType: file.mimetype,
            };

            // Upload file and get download URL
            const snapshot = await uploadBytesResumable(storageRef, file.buffer, metadata);
            const video_link = await getDownloadURL(snapshot.ref);

            return {
                video_title: file.originalname,
                video_link: video_link,
            };
        });

        // Wait for all upload promises to resolve
        const results = await Promise.all(uploadPromises);

        // Attach the formatted results to the request object
        req.downloadUrls = results;

        return next();
    } catch (error) {
        console.log("Error from cloud:", error);
        return res.status(400).send(error.message);
    }
};


  module.exports={
    uploadfileMIddleware,
    uploadMultipleFilesMiddleware,
    uploadMultiple_Vids_MiddlewareForcourse
  }