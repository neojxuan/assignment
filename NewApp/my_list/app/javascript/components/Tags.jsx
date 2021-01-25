import React from "react";
import { Link } from "react-router-dom";

class Tags extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tags: []
    };
  }

  componentDidMount() {
    const url = "/api/v1/tags/index";
    fetch(url)
      .then(response => {
        if (response.ok) {
          return response.json();
        }
        throw new Error("Network response was not ok.");
      })
      .then(response => this.setState({ tags: response }))
      .catch(() => this.props.history.push("/"));
  }

  deleteTag = (id) => {
    const url = `/api/v1/tags/delete/${id}`;
    const token = document.querySelector('meta[name="csrf-token"]').content;
    fetch(url, {
      method: "DELETE",
      headers: {
      "X-CSRF-Token": token,
      "Content-Type": "application/json"
      }
    })
      .then(response => {
      if (response.ok) {
        return response.json();
      }
      throw new Error("Network response was not ok.");
      })
      .then(response => {
        this.setState({tags: this.state.tags.filter((t) => t.id !== id)})
      })
      .catch(error => console.log(error.message));
  }

  render() {
    const { tags } = this.state;
    const allTags = tags.map((tag, index) => (
      <div key={index} className="col-md-6 col-lg-4">
        <div className="card mb-4">
          <div className="card-body">
            <h5 className="card-title">{tag.name}</h5>
            <Link to={`/tag/edit/${tag.id}`} className="btn custom-button">
              Edit Tag
            </Link>
            <div className="btn custom-button" onClick={() => this.deleteTag(tag.id)}>
              Delete Tag
            </div>
          </div>
        </div>
      </div>
    ));
    const noTag = (
      <div className="vw-100 vh-50 d-flex align-items-center justify-content-center">
        <h4>
          No tags yet. Why not <Link to="/new_tag">create one</Link>
        </h4>
      </div>
    );

    return (
      <>
        <section className="text-center">
          <div className="container py-5">
            <h1 className="display-4">All Tags</h1>
          </div>
        </section>
        <div className="py-5">
          <main className="container">
            <div className="text-right mb-3">
              <Link to="/tag" className="btn custom-button">
                Create New Tag
              </Link>
            </div>
              {tags.length > 0 ? allTags : noTag}
            <Link to="/" className="btn btn-link">
              Home
            </Link>
          </main>
        </div>
      </>
    );
  }
}
export default Tags;