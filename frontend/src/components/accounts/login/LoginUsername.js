import React, {useState} from 'react';
import {useDispatch} from 'react-redux';
import {login} from '../../../actions/auth';
import createSnackAlert from "../../../actions/snackAlerts";
import LoginForm from "./LoginForm";

const LoginUsername = ({isAuthenticated}) => {
    const dispatch = useDispatch()
    const [credentials, setCredentials] = useState({
        username: "",
        password: "",
    })

    const handleSubmit = e => {
        e.preventDefault()
        const {username, password} = credentials
        if (username.trim() !== "" && password.trim() !== "") {
            const userCredentials = {
                username,
                password
            }
            dispatch(login(userCredentials, isAuthenticated))
        } else {
            dispatch(createSnackAlert("all fields are required", 400))
        }
    }

    return (
        <LoginForm setCredentials={setCredentials} handleSubmit={handleSubmit} fieldType="username"/>
    )
}

export default LoginUsername