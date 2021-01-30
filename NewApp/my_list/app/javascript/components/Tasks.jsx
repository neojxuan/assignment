import React, {Fragment} from "react";
import { Link } from "react-router-dom";

class Tasks extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tasks: [],
      all_tags: [],
    };
  }

  componentDidMount() {
    const url = "/api/v1/tasks/index";
    fetch(url)
      .then(response => {
        if (response.ok) {
          return response.json();
        }
        throw new Error("Network response was not ok.");
      })
      .then(response => this.setState({ tasks: response }))
      .catch(() => this.props.history.push("/"));

    // get all tags and store in state for search
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

  deleteTask = (id) => {
    const url = `/api/v1/tasks/delete/${id}`;
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
        this.setState({tasks: this.state.tasks.filter((t) => t.id !== id)})
      })
      .catch(error => console.log(error.message));
  }

  render() {
    const { tasks } = this.state;
    const allTasks = tasks.map((task, index) => (
      <div key={index} className="w-100">
        <div className="card mb-4">
          <div className="card-body">
            <h5>{task.title}</h5>
            <div className="float-right">
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
      </div>
    ));
    const noTask = (
      <div className="vw-100 vh-50 d-flex align-items-center justify-content-center">
        <h4>
          No tasks yet. Why not <Link to="/new_task">create one</Link>
        </h4>
      </div>
    );
    
    return (
      <>
        <div className="Search">
          <Link to="/tasks/search" className="btn custom-button">
            Search by Tag
          </Link>
        </div>
        <section className="text-center">
          <div className="container py-5">
            <h1 className="display-4">To-Do List</h1>
          </div>
        </section>
        <div className="py-5">
          <main className="container">
              <Link to="/tags" className="btn custom-button">
                View All Tags
              </Link>
            <div className="text-right mb-3">
              <Link to="/task" className="btn custom-button">
                Create New Task
              </Link>
              <Link to="/tag" className="btn custom-button">
                Create New Tag
              </Link>
            </div>
              {tasks.length > 0 ? allTasks : noTask}
            <Link to="/" className="btn btn-link">
              Home
            </Link>
          </main>
        </div>
        {/* <div>{JSON.stringify(tasks)}</div> */}
      </>
    );
  }
}
export default Tasks;