
module.exports={
    firebaseConfig : {
    apiKey: "AIzaSyDjH-wQG3l4gHtGGU-eaVNpgmwblliaJBs",
    authDomain: "edudev-6b383.firebaseapp.com",
    projectId: "edudev-6b383",
    storageBucket: "edudev-6b383.appspot.com",
    messagingSenderId: "866755652781",
    appId: "1:866755652781:web:f9acda380c76e095d96a24"
  },
}



// export const storage=getStorage();



//   const uploadfileMIddleware=async(req,res)=>{
//     try {
//         const storageRef=ref(storage,`files/${req.file.originalname+" "+Date.now()}`)
//          const metadata={
//             contentType:req.file.mimetype,
//          }
//          const snapshot=await uploadBytesResumable(storageRef,req.file.buffer,metadata);
//          const downloadUrl=await getDownloadURL(snapshot.ref);
//          if(downloadUrl)req.downloadURl=downloadUrl
//         else req.downloadURl=null;
//     } catch (error) {
//         return res.status(400).send(error.message);
//     }
//   }
