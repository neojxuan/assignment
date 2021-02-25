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
      <div key={index} className="col-md-6 col-lg-4" id="width-auto">
        <div className="card mb-4">
          <div className="card-body">
            <h4 className="card-title">{tag.name}</h4>
            <Link to={`/tag/edit/${tag.id}`} className="btn edit">
              Edit Tag
            </Link>
            <div className="btn delete" onClick={() => this.deleteTag(tag.id)}>
              Delete Tag
            </div>
          </div>
        </div>
      </div>
    ));
    const noTag = (
      <div className="vw-100 vh-50 d-flex align-items-center justify-content-center">
        <h4>
          No tags yet. Why not <Link to="/tag">create one</Link>
        </h4>
      </div>
    );

    return (
      <>
        <section className="text-center">
          <div className="max-width py-5">
            <h1 className="display-4">All Tags</h1>
          </div>
        </section>

        <div className="py-5">
          <main className="max-width">
            <div className="text-left mb-3"> 
              <Link to="/tasks" className="btn back-button">
                Back to Tasks
              </Link>
              <Link to="/tag" className="btn green3">
                Create New Tag
              </Link>
            </div>
              {tags.length > 0 ? allTags : noTag}
          </main>
        </div>
      </>
    );
  }
}
export default Tags;