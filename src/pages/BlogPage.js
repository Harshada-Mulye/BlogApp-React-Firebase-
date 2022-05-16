import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  getDocs,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
} from "firebase/firestore";
import { auth, db } from "../firebase-config";

function BlogPage() {
  const postsCollectionRef = collection(db, "posts");
  const [postLists, setPostList] = useState([]);
  let data1;
  const { id } = useParams();

  /*   useEffect(() => {
    const getPosts = async () => {
      const data = await getDocs(postsCollectionRef);
      setPostList(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
      console.log(postLists);
    };

    getPosts();
  }, []); */
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
          .filter((item) => item.id == id)

          .map((post) => {
            return (
              <div className="blogPageWrapper">
                <div className="blogPage">
                <div className="autorPicAndName">
                 <div className="authorPic"></div>
                 <div className="authorName"><span>{post.author.name}</span></div>
                 </div>
                 <div className="postTitleandName">
                <div className="postTitle"><span>{post.title}</span></div>
                <div className="createdDate"><span>{post.createdAt.toDate().toDateString()}</span></div>
                </div>
                <div className="postImage">
                <img
                src={post.imageUrl}
                alt="title"
                style={{ height: 400, width: 400,marginRight:10 }}
              />
              </div>
              <div className="postText">
                <span>{post.postText}</span>
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
