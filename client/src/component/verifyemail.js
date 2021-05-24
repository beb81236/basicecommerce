import React,{useState,useEffect} from 'react'
import {useHistory,useParams} from 'react-router-dom';
import store from '../store';
import {connect} from 'react-redux';
import {HandleEmailVerification} from '../action'





const Verifyemail = ({success_message,error_message}) => {
    const [message,setMessage] = useState();
    const history = useHistory()
    const {token} = useParams();

    
    useEffect(()=>{

        
        
            if(token){
                /*    Proceed with sending the info to the backend   */

                store.dispatch(HandleEmailVerification(token))


            }else{
                history.push('/register')
            }
        

    },[]);

    useEffect(()=>{

        if(success_message && success_message.type === 'verify-email-success'){
            setMessage(success_message)
        }

        if(error_message && error_message.type === 'verify-email-fail'){
                setMessage(error_message)
        }

    },[error_message,success_message]);
    return (
        <div>
            <p>{message ? message.info : null}</p>
        </div>
    )
};

const mapStateToProps =({data:{success_message,error_message}})=>({
    success_message,error_message
})

export default connect(mapStateToProps,null)(Verifyemail)
