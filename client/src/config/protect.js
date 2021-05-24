import React from 'react';
import {Route, Redirect} from 'react-router-dom';



export const ProtectDasboard =({component:Component,token, ...rest})=>{


    return(
        <Route
        {...rest} render={
            props=>{   
                if(token){
                    return <Component {...rest} {...props}/>
                }else{
                    return <Redirect to={
                        {
                            pathname:"/",
                            state:{
                                from:props.location 
                            }
                        }
                    } />
                }
            }
        }

        />
    );
};



export const RedirectHome =({component:Component,token, ...rest})=>{


    return(
        <Route
        {...rest} render={
            props=>{
                if(!token){
                    return <Component {...rest} {...props}/>
                }else{
                    return <Redirect to={
                        {
                            pathname: "/user/dashboard",
                            state:{
                                from:props.location
                            }
                        }
                    } />
                }
            }
        }

        />
    );
};