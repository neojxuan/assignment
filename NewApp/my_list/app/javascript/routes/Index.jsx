import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Home from "../components/Home";
import Tasks from "../components/Tasks";
import Task from "../components/Task";
import NewTask from "../components/NewTask";
import NewTag from "../components/NewTag";
import Tags from "../components/Tags";

export default (
  <Router>
    <Switch>
      <Route path="/" exact component={Home} />
      <Route path="/tasks" exact component={Tasks} />
      <Route path="/task/:id" exact component={Task} />
      <Route path="/task" exact component={NewTask} />
      <Route path="/task/edit/:id" exact component={NewTask} />
      <Route path="/tag" exact component={NewTag} />
      <Route path="/tags" exact component={Tags} />
    </Switch>
  </Router>
);