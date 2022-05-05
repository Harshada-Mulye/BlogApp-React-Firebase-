import React, { useState, useEffect } from "react";
import { addDoc, collection } from "firebase/firestore";
import { db, auth, storage } from "../firebase-config";
import { useNavigate } from "react-router-dom";
import makeid from "./../helper/function";
import { RiDeleteBin5Line } from "react-icons/ri";

function CreatePost({ isAuth }) {
  const [title, setTitle] = useState("");
  const [postText, setPostText] = useState("");
  const [image, setImage] = useState("");
  const [progress, setProgress] = useState(0);
  const postsCollectionRef = collection(db, "posts");
  let navigate = useNavigate();

  const handleChange = (e) => {
    if (e.target.files[0]) {
      setImage(e.target.files[0]);
      var selectedImageSrc = URL.createObjectURL(e.target.files[0]);
      var imagePreview = document.getElementById("image-preview");
      imagePreview.src = selectedImageSrc;
      imagePreview.style.display = "block";
    }
  };

  const createPost = async () => {
    await addDoc(postsCollectionRef, {
      title,
      postText,
      author: { name: auth.currentUser.displayName, id: auth.currentUser.uid },
    });
    navigate("/blog");
  };

  /*  const handleUpload = () => {
    if (image || !image) {
      var imageName = makeid(10);
      const uploadTask = storage.ref(`images/${imageName}.jpg`).put(image);
      uploadTask.on(
        "state_Changed",
        (snapshot) => {
          //progress function
          const progress = Math.round(
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          );
          setProgress(progress);
        },
        (error) => {
          console.log(error);
        },
        () => {
          //get the download URL and upload the post
          storage
            .ref("images")
            .child(`${imageName}.jpg`)
            .getDownloadURL()
            .then((imageUrl) => {
              db.collection("posts").add({
                // timestamp: firebase.firestore.FieldValue.serverTimestamp(),

                title,
                postText,
                // photoUrl: imageUrl,
                author: {
                  name: auth.currentUser.displayName,
                  id: auth.currentUser.uid,
                },
              });
            });

          setProgress(0);
          setImage(null);
          document.getElementById("image-preview").style.display = "none";
        }
      );
    }
  }; */

  useEffect(() => {
    if (!isAuth) {
      navigate("/login");
    }
  }, []);

  return (
    <div className="createPostPage">
      <div className="cpContainer">
        <h1>Create A Post</h1>
        <div className="inputGp">
          <label> Title:</label>
          <input
            placeholder="Title..."
            onChange={(event) => {
              setTitle(event.target.value);
            }}
          />
        </div>
        <div className="inputGp">
          <label> Post:</label>
          <textarea
            placeholder="Post..."
            onChange={(event) => {
              setPostText(event.target.value);
            }}
          />
        </div>
        <div className="postimageupload">
          <label htmlFor="fileInput">
            <RiDeleteBin5Line style={{ cursor: "pointer", fontSize: "20px" }} />{" "}
          </label>
          <input
            id="fileInput"
            type="file"
            accept="image/*"
            onChange={handleChange}
          />
        </div>
        <button onClick={createPost}> Submit Post</button>
        {/*   <button className="uploadbtn" onClick={handleUpload}>
          {`upload ${progress != 0 ? progress : ""}`}
        </button> */}
      </div>
    </div>
  );
}

export default CreatePost;
