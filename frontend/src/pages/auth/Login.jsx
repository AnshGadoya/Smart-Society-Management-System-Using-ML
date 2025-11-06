import React from "react";
import LoginFrom from "../../components/auth/LoginFrom";

function Login({onSelectRole}) {
    return (
        <>
            <LoginFrom onSelectRole={onSelectRole}/>
        </>
    )
}


export default Login;