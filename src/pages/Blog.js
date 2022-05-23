import React, { useEffect, useState } from "react";
import {
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
import { RiDeleteBin5Line } from "react-icons/ri";
import LikeArticle from "./LikeArticle";

function Blog({ isAuth }) {
  const [postLists, setPostList] = useState([]);
  const [user] = useAuthState(auth);
  const [filteredResults, setFilteredResults] = useState([]);
  const [searchInput, setSearchInput] = useState('');

  let part;
  const deletePost = async (id) => {
    const postDoc = doc(db, "posts", id);
    await deleteDoc(postDoc);
  };
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
  const searchItems = (searchValue) => {
    setSearchInput(searchValue)
    if (searchInput !== '') {
      const filteredData = postLists.filter((item) => {
        return Object.values(item).join('').toLowerCase().includes(searchInput.toLowerCase())
      })
      setFilteredResults(filteredData)
    }
    else {
      setFilteredResults(postLists)
    }
  }

  return (
   <div className="blogWrapper">
     <div  className="center">
    <button><span className="fa fa-search "></span></button>
    <input type="text"  placeholder="Search"
     onChange={(e) => searchItems(e.target.value)}/>
  </div>   
  
    <div className="homePage">
   
      {filteredResults.map((post) => {
        return (
          <div className="post" key={post.id}>
            <div className="image">
              <img
                src={post.imageUrl}
                alt="title"
                style={{ height: 250, width: 200, marginRight: 10 }}
              />
            </div>
            <div style={{ marginLeft: 10 }}>
              <div className="postHeader ">
                <div className="title">
                  <Link to={`/blog/${post.id}`}>
                    <span key={post.id}> {post.title}</span>
                  </Link>
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
                    </>
                  )}
                </div>
              </div>
              <div className="postTextContainer">
                <span> {(part = post.postText.slice(0, 120))}...</span>
              </div>
              <div className="cardBottomContainer">
                <div>
                  <img className="authorPic" src={post.userPhoto}></img>
                </div>
                <div className="authorNameAndDate">
                  <div className="authorName">
                    <span>{post.author.name}</span>
                  </div>
                  <div className="createdDate">
                    <span>{post.createdAt.toDate().toDateString()}</span>
                  </div>
                </div>
                <div className="articleLikes">
                  {user && <LikeArticle id={post.id} likes={post.likes} />}
                  <div>
                    <p>{post.likes?.length} likes</p>
                  </div>
                </div>
                <div>
                  {post.comments && post.comments.length > 0 && (
                    <div>
                      <p>{post.comments?.length} comments</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
    </div>
  );
}

export default Blog;
