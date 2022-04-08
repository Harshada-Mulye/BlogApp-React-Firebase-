import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getDocs, collection, deleteDoc, doc } from "firebase/firestore";
import { auth, db } from "../firebase-config";

function BlogPage({ postLists }) {
  const postsCollectionRef = collection(db, "posts");
  //   const [postLists, setPostList] = useState([]);
  let data1;
  const { id } = useParams();

  /*   useEffect(() => {
    const getPosts = async () => {
      let data1;
      const data = await getDocs(postsCollectionRef);
      setPostList(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
      console.log(postLists);
    };

    getPosts();
  }, []); */
  return (
    <div>
      <h1>{id}</h1>
      {
        (data1 = postLists
          .filter((item) => item.id == id)

          .map((post) => {
            return <h1>{post.title}</h1>;
          }))
      }
    </div>
  );
}

export default BlogPage;
