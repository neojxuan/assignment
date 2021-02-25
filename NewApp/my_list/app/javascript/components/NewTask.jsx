import React, {Fragment} from "react";
import { Link, useLocation } from "react-router-dom";
import {withRouter} from "react-router"

class NewTask extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      title: "",
      details: "",
      all_tags: [],
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
        const url = `/api/v1/edit/${match.params.id}`;
        fetch(url)
        .then(response => {
          if (response.ok) {
            return response.json();
          }
          throw new Error("Network response was not ok.");
        })
        .then(response => this.setState({ title: response.title, details: response.details }))
        .catch((err) => console.error(err));
    }
    
    // get all tags and store in state
    const new_url = "/api/v1/tags/index";
    fetch(new_url)
      .then(response => {
        if (response.ok) {
          return response.json();
        }
        throw new Error("Network response was not ok.");
      })
      .then(response => this.setState({ all_tags: response }))
      .catch(() => this.props.history.push("/"));
      console.log(this.state);
  }

  isPathEdit = (path) => path.startsWith("/task/edit");

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

  tagChange = (event) => {
      const stateKey = event.target.name;
      if(this.state.hasOwnProperty(stateKey)) {
         const val = this.state[stateKey];
         this.setState({[stateKey]: !val});
      } else {
        this.setState({[stateKey] : true});
      }
  }

  onSubmit(event) {
    event.preventDefault();
    const {location, match} = this.props;
    const path = location.pathname;
    const url = `/api/v1/tasks/${this.isPathEdit(path) ? `update/${match.params.id}` : 'create' }`;
    const { title, details, tags } = this.state;
    const key_list = Object.keys(this.state);
    const tag_list = key_list.filter(x => x !="title" && x!="details" && x!="all_tags");
    const selected_tags = [];
    for(let i = 0; i < tag_list.length; i++) {
        const tag_id = tag_list[i];
        console.log(this.state[tag_id])
        if(this.state[tag_id]) {
            selected_tags.push(tag_id);
        }
    }
    console.log(selected_tags);
    if (title.length == 0 || details.length == 0) {
        return;
    }
  
    // const body = {
    //     title,
    //     details,
    // };
    const body = { title: this.state.title, details: this.state.details, tags:selected_tags }
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
      .then(response => this.props.history.push(`/task/${response.id}`))
      .catch(error => console.log(error.message));
  }

    render() {
        // const { location } = this.props;
        console.log(this.state.all_tags);
        const arr_tags = this.state.all_tags;
        const display_tags = arr_tags.map((tag) => (
          <div className="in-line-div">
            <Fragment>
              <input type="checkbox" id={tag.id} name={tag.id} value={tag.id} onChange={this.tagChange}/>
              <label for={tag.id} className="btn tag-button">{tag.name}</label>
            </Fragment>
            </div>
          ));
        return (
          <div className="container mt-5">
            <div className="row">
              <div className="col-sm-12 col-lg-6 offset-lg-3">
                <h1 className="font-weight-normal mb-5">
                  {this.isPathEdit(this.props.location.pathname) ? 'Update task' : 'Add a new task'}
                </h1>
                <form onSubmit={this.onSubmit}>
                  <div className="form-group">
                    <label htmlFor="taskTitle">Task Title</label>
                    <input
                      type="text"
                      name="title"
                      id="taskTitle"
                      className="form-control"
                      value = {this.state.title}
                      required
                      onChange={this.onChange}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="taskDetails">Details</label>
                    <input
                      type="text"
                      name="details"
                      id="taskDetails"
                      className="form-control"
                      value={this.state.details}
                      required
                      onChange={this.onChange}
                    />
                  </div>
                  <div>Add Tags</div>
                  <div>{display_tags}</div>

                  <button type="submit" className="btn green3 mt-3">
                    {`${this.isPathEdit(this.props.location.pathname) ? 'Update' : 'Create'} Task`}
                  </button>
                  <Link to="/tasks" className="btn back-button mt-3">
                    Back to Tasks
                  </Link>
                </form>
              </div>
            </div>
          </div>
        );
      }
}

export default withRouter(NewTask);