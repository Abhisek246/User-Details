import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

const Edit = () => {
    const nav = useNavigate();
    const location = useLocation();
    const user = location.state?.user; 
    const [updateData, setUpdateData] = useState({
        first_name: user ? user.first_name : '',
        last_name: user ? user.last_name : '',
        email: user ? user.email : ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUpdateData((prev) => ({ ...prev, [name]: value }));
    };

    const handleUpdate = async (e) => {
        e.preventDefault();

        if(!updateData.first_name || !updateData.last_name || !updateData.email){
            toast.error('Please enter all the details');
            return
        }

        try {
            const response = await axios.put(`https://reqres.in/api/users/${user.id}`, updateData)
            if(response.data){
                let obj = { ...user,...response.data}
                toast.success(`${updateData.first_name} updated successfully`)
                setTimeout(()=>{
                    nav('/list', {state: { obj }});
                }, 1000)      
            }
        } catch (error) {
            console.log('Error updating user', error);
            toast.error('Error updating user')
        }
    };

    return (
        <div className='main-login'>
            <div className='login-container'>
                <div className='login-innercontainer'>
                    <h2>Update</h2>
                    <form>
                        <input
                            type="text"
                            name='first_name'
                            placeholder='First name'
                            value={updateData.first_name}
                            onChange={handleChange}
                        />
                        <input
                            type="text"
                            name='last_name'
                            placeholder='Last name'
                            value={updateData.last_name}
                            onChange={handleChange}
                        />
                        <input
                            type="email"
                            name='email'
                            placeholder='Email'
                            value={updateData.email}
                            onChange={handleChange}
                        />
                        <button onClick={handleUpdate}>Save</button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Edit;