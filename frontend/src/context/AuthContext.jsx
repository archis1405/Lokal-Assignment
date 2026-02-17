import { createContext , useContext , useReducer } from "react";

const initialState = {
    screen : "login" ,
    email: null,
};

function authReducer(state, action){
    switch(action.type){
        case "SEND_OTP":
            return {screen: "otp" , email : action.email};
        case "VERIFY_SUCCESS":
            return {screen : "session" , email: action.email};
        case "LOGOUT":
        case "GO_BACK":
            return initialState
        default :
            return state;
    }
}

const AuthContext = createContext();

export function AuthProvider({children}){
    const [state, dispatch] = useReducer(authReducer, initialState);

    const sendOtp = (email) => dispatch({type:"SEND_OTP" , email});

    const verifySuccess = (email) => dispatch({type:"VERIFY_SUCCESS" , email});

    const logout = () => dispatch({ type: "LOGOUT" });

    const goBack = () => dispatch({ type: "GO_BACK" });

    return (
        <AuthContext.Provider value={{ ...state, sendOtp, verifySuccess, logout, goBack }}>
            {children}
        </AuthContext.Provider>
    );

}


// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return context;
}