import React, {useState} from 'react';
import {useDispatch} from 'react-redux';
import {login} from '../../../actions/auth';
import createSnackAlert from "../../../actions/snackAlerts";
import LoginForm from "./LoginForm";

const LoginEmail = () => {
    const dispatch = useDispatch()
    const [credentials, setCredentials] = useState({
        email   : "",
        password: "",
    })

    const handleSubmit = e => {
        e.preventDefault()
        const {email, password} = credentials
        if (email.trim() !== "" && password.trim() !== "") {
            const userCredentials = {
                email,
                password
            }
            dispatch(login(userCredentials))
        } else {
            dispatch(createSnackAlert("all fields are required", 400))
        }
    }
    return (
        <LoginForm setCredentials={setCredentials} handleSubmit={handleSubmit} fieldType="email"/>
    )
}

export default LoginEmail