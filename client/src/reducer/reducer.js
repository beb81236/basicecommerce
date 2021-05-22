import { REGISTER_FAIL, REGISTER_SUCCESS,LOGIN_FAIL,LOGIN_SUCCESS } from "../action/types";
const initialState = {
  token: localStorage.getItem('token'),
  isAuthenticated: false,
  payments: [],
  user: null,
  error_message: null,
  success_message: null,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case REGISTER_SUCCESS:
      return {
        ...state,
        success_message: action.payload,
        error_message:null
      };

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


    default:
      return state;
  }
};
