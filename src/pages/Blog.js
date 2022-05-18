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
 import { useAuthState } from "react-firebase-hooks/auth";
import { useParams } from "react-router-dom"; 

import { RiDeleteBin5Line } from "react-icons/ri";

import LikeArticle from "./LikeArticle";

function Blog({ isAuth }) {
  const [postLists, setPostList] = useState([]);
  const { id } = useParams();
  const [user] = useAuthState(auth);
  console.log("user name",user)
  // const postsCollectionRef = collection(db, "posts");
  /*const [isOpen, setIsOpen] = useState(false);
  const [postToUpdate, setPostToUpdate] = useState();
  const [idToUpdate, setidToUpdate] = useState(); */
  let part;
  /* function openModal(id, name) {
    setIsOpen(true);
    setidToUpdate(id);
    setPostToUpdate(name);
  } */
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

  // const closeModal = () => setIsOpen(false);

  return (
    <div className="homePage">
    
      {postLists.map((post) => {
        return (
          <div className="post">
            <div className="image">
             <img
                src={post.imageUrl}
                alt="title"
                style={{ height: 250, width: 200,marginRight:10 }}
              />
              </div>
              <div style={{ marginLeft:10 }}> 
            <div className="postHeader ">
              <div className="title">
              <Link to={`/blog/${post.id}`}>
                <span key={post.id}> {post.title}</span></Link>
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
             <span> {(part = post.postText.slice(0,50))}</span>
              {part}...
            </div>
            <div className="cardBottomContainer">
            <div className="authorPic"></div>
            <div className="authorNameAndDate">
            <div className="authorName"><span>{post.author.name}</span></div>
            <div className="createdDate"><span>{post.createdAt.toDate().toDateString()}</span></div>
            <div className="articleLikes">
              {user && <LikeArticle id={id} likes={post.likes} />}
              <div className="pe-2">
                <p>{post.likes.length}</p>
              </div> 
            </div>
            </div>
            </div>

           
          </div>
          </div>
        );
      })}
    </div>
  );
}

export default Blog;
