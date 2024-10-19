import React, { useState } from 'react'
import './Login.css'
import { toast } from 'react-toastify';
import axios from 'axios'
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [formData, setFormData] = useState({
        email: '',
        password:''
    })
    const nav = useNavigate();

    const handleChange = (e)=>{
        const {name, value} = e.target;
        setFormData((prev)=>({...prev, [name]: value}))
    }
 
    const handleLogin = async (e)=>{
        e.preventDefault()
        console.log(formData)

        if(!formData.email || !formData.password){
            toast.error('Please enter Email and Password');
            return
        }

        if(formData.email !== 'eve.holt@reqres.in' || formData.password !== 'cityslicka'){
            toast.error('Email or Password is incorrect');
            return;
        }
        try {
            const response = await axios.post('https://reqres.in/api/login', {
                email: formData.email, 
                password: formData.password
            })
            localStorage.setItem('token', response.data.token)
            toast.success('Login successfull');

            setTimeout(()=>{
                nav('/list')
            }, 1000)

        } catch (error) {
            console.error('Login failed:', error);
            toast.error('Login failed, please try again');
        }
        
    }


  return (
    <div className='main-login'>
        <div className='login-container'>
            <div className='login-innercontainer'>
                <h2>Login</h2>
                <form>
                    <input type="email" placeholder='Email' name='email' value={formData.email} onChange={handleChange} required/>
                    <input type="password" placeholder='Password' name='password' value={formData.password} onChange={handleChange} required/>
                    <button onClick={handleLogin}>Login</button>
                </form>
            </div>
        </div>
    </div>
  )
}

export default Login