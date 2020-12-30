import React, { useEffect, useState } from "react";

function PostList() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const requestPosts = async () => {
      const response = await fetch("/api/posts");
      const { data } = await response.json();
      setPosts(data);
    };
    requestPosts();
  }, []);

  return posts.map(post => <div>{post.attributes.title}</div>);
}

export default PostList;