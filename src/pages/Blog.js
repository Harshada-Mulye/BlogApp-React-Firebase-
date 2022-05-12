import React, { useEffect, useState } from "react";
import {
  getDocs,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
} from "firebase/firestore";
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
  let part;
  function openModal(id, name) {
    setIsOpen(true);
    setidToUpdate(id);
    setPostToUpdate(name);
  }
  const deletePost = async (id) => {
    const postDoc = doc(db, "posts", id);
    await deleteDoc(postDoc);
  };
  /*   useEffect(() => {
    const getPosts = async () => {
      const data = await getDocs(postsCollectionRef);
      setPostList(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    };

    getPosts();
  }, [deletePost]); */
  useEffect(() => {
    const articleRef = collection(db, "posts");
    const q = query(articleRef, orderBy("createdAt", "desc"));
    onSnapshot(q, (snapshot) => {
      const articles = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setPostList(articles);
      console.log(articles);
    });
  }, []);

  const closeModal = () => setIsOpen(false);

  return (
    <div className="homePage">
      {/* {isOpen && (
        <Modal id={idToUpdate} name={postToUpdate} closeAction={closeModal} />
      )} */}
      {postLists.map((post) => {
        return (
          <div className="post">
            <div className="image">
             <img
                src={post.imageUrl}
                alt="title"
                style={{ height: 300, width: 180,marginRight:10 }}
              />
              </div>
              <div style={{ marginLeft:10 }}> 
            <div className="postHeader">
              <div className="title">
              <Link to={`/blog/${post.id}`}>
                <h1 key={post.id}> {post.title}</h1></Link>
              </div>
              <div className="deletePost">
                {isAuth && post.author.id === auth.currentUser.uid && (
                  <>
                    <RiDeleteBin5Line
                      style={{ fontSize: "20px", color: "#660000" }}
                      onClick={() => {
                        deletePost(post.id);
                      }}
                    />

                    {/*  <AiFillEdit onClick={() => openModal(post.id, post.postText)}/> */}
                  </>
                )}
              </div>
             
            </div>
            <div className="postTextContainer">
              {(part = post.postText.slice(1, 50))}
              {part}...
            </div>
            <div>
            <h4>Created At{post.createdAt.toDate().toDateString()}</h4>
            <h3>@{post.author.name}</h3>
            </div>

           
          </div>
          </div>
        );
      })}
    </div>
  );
}

export default Blog;
