import React from 'react'
import {Button } from '@material-ui/core'
import '../static/css/login.css'
import {auth, provider} from '../firebase'
import { actionType } from '../reducer'
import { useStateValue } from '../StateProvider'


export default function Login() {
    const [{},dispatch] = useStateValue()
    const signIn=()=>{
        auth.signInWithPopup(provider)
            .then(result=>{
                dispatch({
                    type: actionType.SET_USER,
                    user:result.user
                })
                localStorage.setItem('user',JSON.stringify(result.user))
            })
            .catch(err=>alert(err.message))
    }


    return (
        <div className="login">
            <div className="login__container">
                <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/WhatsApp.svg/1200px-WhatsApp.svg.png" alt="whatsapp" />
                <div className="Login__text">
                    <h1>Sign in to whatsapp</h1>
                </div>
                <Button onClick={signIn}>Sign in with Google</Button>
            </div>
        </div>
    )
}
