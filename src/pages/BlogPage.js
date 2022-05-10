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
              <div>
                <h1>{post.title}</h1>
                <h1>{post.postText}</h1>
              </div>
            );
          }))
      }
    </div>
  );
}

export default BlogPage;
