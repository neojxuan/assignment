import React, {Fragment} from "react";
import { Link } from "react-router-dom";

class Task extends React.Component {
  constructor(props) {
    super(props);
    this.state = {task:{title:"test", details:"HELPMEPLSPLSPLSS", tags:[]}};

    this.addHtmlEntities = this.addHtmlEntities.bind(this);
  }

  componentDidMount() {
    const {
      match: {
        params: { id }
      }
    } = this.props;

    const url = `/api/v1/show/${id}`;

    fetch(url)
      .then(response => {
        if (response.ok) {
          return response.json();
        }
        throw new Error("Network response was not ok.");
      })
      .then(response => this.setState({ task: response }))
      .catch(() => this.props.history.push("/tasks"));
    }

  addHtmlEntities(str) {
    return String(str)
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">");
  }

  render() {
    const { task } = this.state;
    // somehow task.tag is undefined
    if(task.tag == undefined) {
      console.log("undef");
    }
    // force task.tag to become a javascript array
    const arr_tag_objects = JSON.parse(JSON.stringify(task.tags));
    const display_tags = arr_tag_objects.map((tag) => (
          <Fragment>
            <button type="button">{tag.name}</button>
          </Fragment>
        ));
    return (
      <div className="parent element for render">
        <h1>{task.title}</h1>
        <p>Details: {task.details}</p>
        <div>{display_tags}</div>
      </div>
    );
  }

}

export default Task;

