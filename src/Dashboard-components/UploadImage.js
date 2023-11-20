import React, { useEffect, useState } from 'react';
import { getDownloadURL, getStorage, listAll, ref, uploadBytes } from 'firebase/storage';
import { collection, addDoc, getDocs } from 'firebase/firestore';
import { app, firestore } from '../FirebaseConfig/Firebase'; 
import './notification.css';

const UploadImage = () => {
  const [image, setImage] = useState('');
  const [imagesList, setImagesList] = useState([]);

  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const handleUpload = () => {
    if (image) {
      const storage = getStorage(app);
      const storageRef = ref(storage, image.name);

      uploadBytes(storageRef, image).then(async () => {
        
        const downloadURL = await getDownloadURL(storageRef);

        
        await addImageToFirestore(downloadURL);

        alert('Image uploaded successfully!');
        listAllImages();
      }).catch((error) => {
        console.error('Error uploading image', error);
      });
    } else {
      console.error('No image selected');
    }
  };

  const addImageToFirestore = async (downloadURL) => {
    const imagesCollection = collection(firestore, 'images'); 

    try {
      await addDoc(imagesCollection, { imageUrl: downloadURL });
    } catch (error) {
      console.error('Error adding image to Firestore', error);
    }
  };

  const listAllImages = async () => {
    const imagesCollection = collection(firestore, 'images'); 

    try {
      const querySnapshot = await getDocs(imagesCollection);
      const downloadURLs = querySnapshot.docs.map((doc) => doc.data().imageUrl);

      setImagesList(downloadURLs);
    } catch (error) {
      console.error('Error listing images from Firestore', error);
    }
  };

  useEffect(() => {
    listAllImages();
  }, []);

  return (
    <>
      <div>
        <div className='card' style={{ height: '30vh' }}>
          <input
            className='notification'
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            required
          />
          <div style={{ width: '100%', justifyContent: 'center', display: 'flex', marginTop: '20px' }}>
            <button onClick={handleUpload} style={{ borderRadius: '5px', width: '10%' }}>
              Upload
            </button>
          </div>
        </div>
      </div>

      <div className='icon-card' style={{ height: '50vh', display: 'flex', overflowX: 'auto' }}>
        {imagesList.map((imageUrl, index) => (
          <img className='icons' key={index} src={imageUrl} alt={`Image ${index}`} />
        ))}
      </div>
    </>
  );
};

export default UploadImage;
