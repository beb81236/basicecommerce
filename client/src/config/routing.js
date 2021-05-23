import React from "react";
import { Route, Switch } from "react-router-dom";
import Login from "../component/login";
import Register from "../component/register";
import VerifyEmail from "../component/verifyemail";
import Dashboard from "../component/dashboard";
const Routing = () => {
  return (
    <Switch>
      <Route exact path="/" component={Login} />
      <Route exact path="/register" component={Register} />
      <Route exact path="/verifyemail/:token" component={VerifyEmail} />
      <Route exact path="/user/dashboard" component={Dashboard} />
    </Switch>
  );
};

export default Routing;
