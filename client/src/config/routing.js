import React from "react";
import { Route, Switch } from "react-router-dom";
import Login from "../component/login";
import Register from "../component/register";
import VerifyEmail from "../component/verifyemail";
import Dashboard from "../component/dashboard";
import {RedirectHome,ProtectDasboard} from './protect'
import {connect} from 'react-redux';


const Routing = ({token}) => {
  return (
    <Switch>
      <RedirectHome exact path="/" token={token} component={Login} />
      <RedirectHome exact path="/register" token={token} component={Register} />
      <Route exact path="/verifyemail/:token" component={VerifyEmail} />
      <ProtectDasboard token={token} exact path="/user/dashboard" component={Dashboard} />
    </Switch>
  );
};

const mapStateToProps =({data:{token}})=>({
  token
})

export default connect(mapStateToProps, null)(Routing);
