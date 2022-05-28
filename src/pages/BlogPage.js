import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { auth, db } from "../firebase-config";
import Comments from "./Comments";
import LikeArticle from "./LikeArticle";

function BlogPage() {
  const [postLists, setPostList] = useState([]);
  const [user] = useAuthState(auth);
  let data1;
  const { id } = useParams();

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
  return (
    <div>
      {
        (data1 = postLists
          //filter the posts
          .filter((item) => item.id == id)

          .map((post) => {
            return (
              <div className="blogPageWrapper">
                <div className="blogPage">
                  <div className="autorPicAndName">
                    <div>
                      <img src={post.userPhoto} className="authorPic"></img>
                    </div>
                    <div className="authorName">
                      <span>{post.author.name}</span>
                    </div>
                  </div>
                  <div className="postTitleandName">
                    <div className="postTitle">
                      <span>{post.title}</span>
                    </div>
                    <div className="createdDate">
                      <span>{post.createdAt.toDate().toDateString()}</span>
                    </div>
                  </div>
                  <div className="postImage">
                    <img
                      src={post.imageUrl}
                      alt="title"
                      style={{ height: 400, width: 400, marginRight: 10 }}
                    />
                  </div>
                  <div className="postText">
                    <span>{post.postText}</span>
                  </div>
                  <div className="d-flex flex-row-reverse">
                    {user && <LikeArticle id={post.id} likes={post.likes} />}
                    <div className="pe-2">
                      <p>{post.likes.length}</p>
                    </div>
                  </div>
                  <div>
                    {" "}
                    <Comments id={post.id} />
                  </div>
                </div>
              </div>
            );
          }))
      }
    </div>
  );
}

export default BlogPage;
//blogpage
