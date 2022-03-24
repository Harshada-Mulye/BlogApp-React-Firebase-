import React from 'react'
import { useState } from 'react'
import { updateDoc,doc } from "firebase/firestore";
import {  db } from "../firebase-config";
const Modal = (props) => {
  const [newPost, setNewPost] = useState('')

  const updatePost = (id,  postText,) => {
    if ( postText !== '') {
      editPost(id,  postText)
    } else {
      alert('Please enter value')
    }
    props.closeAction()
  }
  
  const editPost = async (id, postText) => {
    const postDoc = doc(db, "posts", id);
    const newFields = { postText: postText }
    await updateDoc(postDoc,newFields);
  };
  

  return (
    <div>
      <textarea
        name="task"
        type="text"
        placeholder="post"
        className="task-input"
        required
        onChange={(event) => {
          setNewPost(event.target.value)
        }}
      />
      <button
        className="update"
        type="submit"
        onClick={() => {
          updatePost(props.id, newPost)
        }}
      >
        Update
      </button>
    </div>
  )
}

export default Modal