import React, { useEffect, useState } from "react";
import { getDocs, collection, deleteDoc, doc } from "firebase/firestore";
import { Link } from "react-router-dom";
import { auth, db } from "../firebase-config";
import { AiFillEdit } from "react-icons/ai";
import { RiDeleteBin5Line } from "react-icons/ri";
import Modal from "./Modal";

function Blog({ isAuth }) {
  const [postLists, setPostList] = useState([]);
  const postsCollectionRef = collection(db, "posts");
  const [isOpen, setIsOpen] = useState(false);
  const [postToUpdate, setPostToUpdate] = useState();
  const [idToUpdate, setidToUpdate] = useState();

  function openModal(id, name) {
    setIsOpen(true);
    setidToUpdate(id);
    setPostToUpdate(name);
  }
  const deletePost = async (id) => {
    const postDoc = doc(db, "posts", id);
    await deleteDoc(postDoc);
  };
  useEffect(() => {
    const getPosts = async () => {
      const data = await getDocs(postsCollectionRef);
      setPostList(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    };

    getPosts();
  }, [deletePost]);

  const closeModal = () => setIsOpen(false);

  return (
    <div className="homePage">
      {/* {isOpen && (
        <Modal id={idToUpdate} name={postToUpdate} closeAction={closeModal} />
      )} */}
      {postLists.map((post) => {
        return (
          <div className="post">
            <div className="postHeader">
              <div className="title">
                <h1 key={post.id}> {post.title}</h1>
              </div>
              <div className="deletePost">
                {isAuth && post.author.id === auth.currentUser.uid && (
                  <div>
                    <RiDeleteBin5Line
                      style={{ fontSize: "20px", color: "#660000" }}
                      onClick={() => {
                        deletePost(post.id);
                      }}
                    />

                    {/*  <AiFillEdit onClick={() => openModal(post.id, post.postText)}/> */}
                  </div>
                )}
              </div>
            </div>
            <h3>@{post.author.name}</h3>
            <div className="postTextContainer"> {post.postText} </div>

            <Link to={`/blog/${post.id}`}>View</Link>
          </div>
        );
      })}
    </div>
  );
}

export default Blog;
