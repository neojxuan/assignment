import React from "react";
import { Router } from "@reach/router";
import PostList from "./PostList";
import AddPost from "./AddPost";

function App() {
  return (
    <Router>
      <PostList path="/" />
      <AddPost path="/add" />
    </Router>
  );
}

export default App;