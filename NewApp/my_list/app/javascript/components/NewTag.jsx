import React from "react";
import { Link, useLocation } from "react-router-dom";
import {withRouter} from "react-router"

class NewTask extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        name: ""
    };

  this.onChange = this.onChange.bind(this);
  this.onSubmit = this.onSubmit.bind(this);
  this.stripHtmlEntities = this.stripHtmlEntities.bind(this);
  }

  componentDidMount() {
    const { match, location, history } = this.props;
    const path = location.pathname;
    console.log(path);
    if(this.isPathEdit(path)) {
        const url = `/api/v1/tag/edit/${match.params.id}`;
        fetch(url)
        .then(response => {
          if (response.ok) {
            return response.json();
          }
          throw new Error("Network response was not ok.");
        })
        .then(response => this.setState({ name: response.name }))
        .catch((err) => console.error(err));
    }

  }

  isPathEdit = (path) => path.startsWith("/tag/edit");

  stripHtmlEntities(str) {
    return String(str)
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
  }

  onChange(event) {
    const stateKey = event.target.name;
    const stateValue = event.target.value;
    this.setState({ [stateKey]: stateValue });
  }

  onSubmit(event) {
    console.log("here")
    event.preventDefault();
    const {location, match} = this.props;
    const path = location.pathname;
    const url = `/api/v1/tag/${this.isPathEdit(path) ? `update/${match.params.id}` : 'create' }`;
    const { name } = this.state;
  
    if (name.length == 0) {
        return;
    }
  
    // const body = {
    //     title,
    //     details,
    // };
    const body = { name: this.state.name }
    console.log(body)
    const token = document.querySelector('meta[name="csrf-token"]').content;
    fetch(url, {
      method: this.isPathEdit(path) ? "PUT" : "POST",
      headers: {
      "X-CSRF-Token": token,
      "Content-Type": "application/json"
      },
      body: JSON.stringify(body)
    })
      .then(response => {
      if (response.ok) {
        return response.json();
      }
      throw new Error("Network response was not ok.");
      })
      .then(response => this.props.history.push("/tags"))
      .catch(error => console.log(error.message));
  }

    render() {
        // const { location } = this.props;
        console.log(this.state);
        return (
          <div className="container mt-5">
            <div className="row">
              <div className="col-sm-12 col-lg-6 offset-lg-3">
                <h1 className="font-weight-normal mb-5">
                  {this.isPathEdit(this.props.location.pathname) ? 'Update tag' : 'Add a new tag'}
                </h1>
                <form onSubmit={this.onSubmit}>
                  <div className="form-group">
                    <label htmlFor="tagName">Tag Name</label>
                    <input
                      type="text"
                      name="name"
                      id="tagName"
                      className="form-control"
                      value = {this.state.name}
                      required
                      onChange={this.onChange}
                    />
                  </div>
                  <button type="submit" className="btn custom-button mt-3">
                    {`${this.isPathEdit(this.props.location.pathname) ? 'Update' : 'Create'} Tag`}
                  </button>
                  <Link to="/tasks" className="btn btn-link mt-3">
                    Back to tasks
                  </Link>
                </form>
              </div>
            </div>
          </div>
        );
      }
}

export default withRouter(NewTask);