import React from "react";
import { Link } from "react-router-dom";

export default () => (
  <div className="vw-100 vh-100 primary-color d-flex align-items-center justify-content-center">
      <div className="container secondary-color">
        <h1 className="display-4 text-center">To-Do List</h1>
        <hr className="my-4" />
        <Link
          to="/tasks"
          className="btn btn-lg custom-button mx-auto d-block"
          role="button"
        >
          View Tasks
        </Link>
      </div>
  </div>
);