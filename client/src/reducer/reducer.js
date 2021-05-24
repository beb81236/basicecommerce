import { REGISTER_FAIL, REGISTER_SUCCESS,LOGIN_FAIL,
  LOGIN_SUCCESS,VERIFY_EMAIL_FAIL,VERIFY_EMAIL_SUCCESS,GET_USER,INITIATE_PAYMENT_FAIL,INITIATE_PAYMENT_SUCCESS } from "../action/types";
const initialState = {
  token: localStorage.getItem('token'),
  payments: [],
  user: null,
  error_message: null,
  success_message: null,
};

export default (state = initialState, action) => {
  switch (action.type) {


    case INITIATE_PAYMENT_SUCCESS:
    case VERIFY_EMAIL_SUCCESS:
    case REGISTER_SUCCESS:
      return {
        ...state,
        success_message: action.payload,
        error_message:null
      };

    case INITIATE_PAYMENT_FAIL:
    case VERIFY_EMAIL_FAIL:
    case LOGIN_FAIL:
    case REGISTER_FAIL:
      return {
        ...state,
        error_message: action.payload,
        success_message:null
      };

    case LOGIN_SUCCESS:
        localStorage.setItem('token', action.payload.info)
        return{
            ...state,
            token:action.payload.info,
            success_message:null,
            error_message:null
        };

      case GET_USER:
        return{
          ...state,
          user:action.payload,
          payments:action.payload.payments
        }

    default:
      return state;
  }
};
