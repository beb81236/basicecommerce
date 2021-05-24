
import Axios from 'axios';
import {REGISTER_FAIL,REGISTER_SUCCESS,
    LOGIN_FAIL,LOGIN_SUCCESS,VERIFY_EMAIL_FAIL,
    VERIFY_EMAIL_SUCCESS,
    GET_USER,
    INITIATE_PAYMENT_FAIL,
    INITIATE_PAYMENT_SUCCESS,
    PAYMENT_FAIL,
    PAYMENT_SUCCESS
} from './types'

let baseURL = 'https://basicecommerec.herokuapp.com/'
let config = {
    headers:{
        "Content-Type":"application/json"
    }
};


const getToken =()=>{
    let token = localStorage.getItem('token');

    if(token){
        config.headers['X-AUTH-TOKEN'] = token;
    }


    return config;
}


export const HandleUserRegistration =(data)=> async (dispatch)=>{
    try {

        const body = JSON.stringify(data);

        let response = await Axios.post(baseURL + `api/auth/register`, body,config);

        response = response.data;

        return dispatch({
            type:REGISTER_SUCCESS,
            payload:{
                type:'register-success',
                info:'Registration successful, a verification link has been sent to your email.'
            }
        })
        
    } catch (error) {
        
        error= error.response.data;

        return dispatch({
            type:REGISTER_FAIL,
            payload:{
                type:'register-fail',
                info:error.message
            }
        });
    }
};



export const HandleUserLogin = (data) => async (dispatch)=>{
    try {

        let body = JSON.stringify(data);
        let response = await Axios.post(baseURL + `api/auth/login`, body,config);

        response = response.data;

        return dispatch({
            type:LOGIN_SUCCESS,
            payload:{
                type:'login-success',
                info:response.message
            }
        })
        
    } catch (error) {
        
        error = error.response.data;

        return dispatch({
            type:LOGIN_FAIL,
            payload:{
                type:'login-fail',
                info:error.message
            }
        })

    }
};

export const HandleEmailVerification =(token)=> async (dispatch)=>{
    try {

        let response = await Axios.post(baseURL + `api/auth/verifyemail/${token}`,config);
        response= response.data;
        

        return dispatch({
            type:VERIFY_EMAIL_SUCCESS,
            payload:{
                type:'verify-email-success',
                info:response.message
            }
        })
        
        
    } catch (error) {
        error = error.response.data;

        return dispatch({
            type:VERIFY_EMAIL_FAIL,
            payload:{
                type:'verify-email-fail',
                info:error.message
            }
        })
    }
};



export const HandleGetUserDetails =()=> async (dispatch)=>{
    try {

        let response = await Axios.get(baseURL +  'users/me',getToken());
        response = response.data;

        dispatch({
            type:GET_USER,
            payload:response.message
        })


        
    } catch (error) {
        console.log(error)
    }
};


export const HandleInitiatePayment = (data) => async (dispatch)=>{
    try {
        // console.log(data)
        let body = JSON.stringify(data)
        let response = await Axios.post(baseURL + 'api/payment/initiate',body,getToken());

        response = response.data;
        console.log(response)
        dispatch({
            type:INITIATE_PAYMENT_SUCCESS,
            payload:{
                type:'inititate-payment-success',
                info:response.paymentLink
            }
        })


        
    } catch (error) {
        error = error.response.data;

        dispatch({
            type:INITIATE_PAYMENT_FAIL,
            payload:{
                type:'initiate-payment-fail',
                info:error.message
            }
        })
    }
}