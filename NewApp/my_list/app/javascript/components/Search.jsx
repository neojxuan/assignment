import React, {Fragment} from "react";
import { Link } from "react-router-dom";
import {withRouter} from "react-router"

class Search extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      all_tags: [],
      tasks: [],
      tasks_to_display: [],
    };
  }

  componentDidMount() {
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
    // const {location, match} = this.props;
    // const path = location.pathname;
    const url = `/api/v1/tasks/search`;
    // const { title, details, tags } = this.state;
    const key_list = Object.keys(this.state);
    const tag_list = key_list.filter(x => x!="all_tags" && x!="tasks" && x!="tasks_to_display");
    const selected_tags = [];
    for(let i = 0; i < tag_list.length; i++) {
        const tag_id = tag_list[i];
        if(this.state[tag_id]) {
            selected_tags.push(tag_id);
        }
    }
    console.log(selected_tags);

    const body = { selected_tags:selected_tags }
    console.log(body)
    const token = document.querySelector('meta[name="csrf-token"]').content;
    fetch(url, {
      method: "POST",
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
      .then(response => {
        this.setState({tasks: response})
      })
      .catch(error => console.log(error.message));
  }
  
  render() {
    const arr_tags = this.state.all_tags;
    const display_tags = arr_tags.map((tag) => (
      <Fragment>
        <input type="checkbox" key={tag.id} id={tag.id} name={tag.id} value={tag.id} onChange={this.tagChange}/>
        <label for={tag.id} className="btn tag-button">{tag.name}</label>
      </Fragment>
    ));
    // const remove_duplicates = this.state.tasks.filter(x => );
    const allTasks = this.state.tasks.map((task, index) => (
        <div key={index} className="col-md-6 col-lg-4">
            <div className="card mb-4">
            <div className="card-body">
                <h5 className="card-title">{task.title}</h5>
                <Link to={`/task/${task.id}`} className="btn custom-button">
                View Task
                </Link>
                <Link to={`/task/edit/${task.id}`} className="btn custom-button">
                Edit Task
                </Link>
                <div className="btn custom-button" onClick={() => this.deleteTask(task.id)}>
                Delete Task
                </div>
            </div>
            </div>
        </div>
        ));

    const noTask = (
      <div className="vw-100 vh-50 d-flex justify-content-center">
        <h4>
          No tasks selected yet.
        </h4>
      </div>
    );
    return (
      <>
        <section className="text-center">
          <div className="container py-5">
            <h1 className="display-4">Search Tasks</h1>
          </div>
        </section>

        <div className="container">
          {display_tags}
        </div>
        <div>{this.state.tasks.length > 0 ? allTasks : noTask}</div>
        <div className="container">
          <button type="submit" className="btn custom-button" onClick={(e) => this.onSubmit(e)}>
            Search
          </button>
          <button type="button" className="btn custom-button" value="reload page" onClick={() => this.props.history.go(0)()}>Clear Search</button>
        </div>
        <div className="py-5">
          <main className="container">
            <Link to="/" className="btn btn-link">
              Home
            </Link>
          </main>
        </div>
      </>
    );
  }
}
export default Search;