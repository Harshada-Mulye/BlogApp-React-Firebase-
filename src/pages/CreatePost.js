/*import React, { useState, useEffect } from "react";
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

/* useEffect(() => {
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
        </button> */
/*  </div>
    </div>
  );
}

export default CreatePost;
*/

import React, { useState, useEffect } from "react";
import { Timestamp, collection, addDoc } from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { storage, db, auth } from "../firebase-config";
import { useNavigate } from "react-router-dom";
//import { toast } from "react-toastify";

import { Link } from "react-router-dom";

function CreatePost({ isAuth }) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    image: "",
    createdAt: Timestamp.now().toDate(),
  });
  let navigate = useNavigate();
  useEffect(() => {
    if (!isAuth) {
      navigate("/login");
    }
  }, []);
  const [progress, setProgress] = useState(0);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    setFormData({ ...formData, image: e.target.files[0] });
  };

  const handlePublish = () => {
    if (!formData.title || !formData.description || !formData.image) {
      alert("Please fill all the fields");
      return;
    }

    const storageRef = ref(
      storage,
      `/images/${Date.now()}${formData.image.name}`
    );

    const uploadImage = uploadBytesResumable(storageRef, formData.image);

    uploadImage.on(
      "state_changed",
      (snapshot) => {
        const progressPercent = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );
        setProgress(progressPercent);
      },
      (err) => {
        console.log(err);
      },
      () => {
        setFormData({
          title: "",
          description: "",
          image: "",
        });

        getDownloadURL(uploadImage.snapshot.ref).then((url) => {
          const articleRef = collection(db, "posts");
          addDoc(articleRef, {
            title: formData.title,
            postText: formData.description,
            imageUrl: url,
            author: {
              name: auth.currentUser.displayName,
              id: auth.currentUser.uid,
            },
            createdAt: Timestamp.now().toDate(),
          })
            .then(() => {
              //   toast("Article added successfully", { type: "success" });
              setProgress(0);
            })
            .catch((err) => {
              //   toast("Error adding article", { type: "error" });
            });
        });
      }
    );
  };

  return (
    <div className="border p-3 mt-3 bg-light" style={{ position: "fixed" }}>
      <h2>Create article</h2>
      <div className="form-group">
        <label htmlFor="">Title</label>
        <input
          type="text"
          name="title"
          className="form-control"
          value={formData.title}
          onChange={(e) => handleChange(e)}
        />
      </div>

      {/* description */}
      <label htmlFor="">Description</label>
      <textarea
        name="description"
        className="form-control"
        value={formData.description}
        onChange={(e) => handleChange(e)}
      />

      {/* image */}
      <label htmlFor="">Image</label>
      <input
        type="file"
        name="image"
        accept="image/*"
        className="form-control"
        onChange={(e) => handleImageChange(e)}
      />

      {progress === 0 ? null : (
        <div className="progress">
          <div
            className="progress-bar progress-bar-striped mt-2"
            style={{ width: `${progress}%` }}
          >
            {`uploading image ${progress}%`}
          </div>
        </div>
      )}
      <button className="form-control btn-primary mt-2" onClick={handlePublish}>
        Publish
      </button>
    </div>
  );
}

export default CreatePost;
