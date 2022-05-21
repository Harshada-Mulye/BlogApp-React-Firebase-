import React, { useState, useEffect } from "react";
import { Timestamp, collection, addDoc } from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { storage, db, auth } from "../firebase-config";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import { Link } from "react-router-dom";

function CreatePost({ isAuth }) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    image: "",
    createdAt: Timestamp.now().toDate(),
  });
  const [userPhoto, setUserPhoto] = useState(localStorage.getItem("UserPhoto"));
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
            userPhoto: userPhoto,
            likes: [],
            comments: [],
          })
            .then(() => {
              toast("Article added successfully", { type: "success" });
              setProgress(0);
            })
            .catch((err) => {
              toast("Error adding article", { type: "error" });
            });
        });
      }
    );
  };

  return (
    <div
      className="border p-3 mt-3 flex-column "
      style={{ margin: "auto", width: "50%", backgroundColor: "lightgray" }}
    >
      <h2 className="text-center">Create Post</h2>
      <div className="form-group">
        <label className="h5 " htmlFor="">
          Title
        </label>
        <input
          type="text"
          name="title"
          className="form-control"
          value={formData.title}
          onChange={(e) => handleChange(e)}
        />
      </div>

      {/* description */}
      <label className="h5 mt-3" htmlFor="">
        Description
      </label>
      <textarea
        name="description"
        rows="5"
        className="form-control"
        value={formData.description}
        onChange={(e) => handleChange(e)}
      />

      {/* image */}
      <label className="h5 mt-3" htmlFor="">
        Image
      </label>
      <input
        type="file"
        name="image"
        accept="image/*"
        className="form-control "
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
      <button className="form-control btn-primary mt-4" onClick={handlePublish}>
        Publish
      </button>
    </div>
  );
}

export default CreatePost;
