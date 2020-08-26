const INITIAL_STATE = {
    email: "",
    password: ""
};

//Action Handler
export default (state = INITIAL_STATE, action) => {
    console.log("authReducer", action.type);
    switch (action.type) {
        case "authUpdate":
            console.log("auth Reducer authUpdate");
            return {...state, [action.payload.field]: action.payload.value};
    default: 
    console.log("authReducer type didn't affect me");
    return state;
        }
};