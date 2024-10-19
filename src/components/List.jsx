import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './List.css';
import { toast } from 'react-toastify';
import { useNavigate, useLocation } from 'react-router-dom';

const List = () => {
    const [users, setUsers] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const location = useLocation();
    const updatedUser = location.state?.obj;
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [search, setSearch] = useState('');

    const nav = useNavigate();

    useEffect(() => {
        if (search) {
            const results = users.filter((user) =>
                user.first_name.toLowerCase().includes(search.toLowerCase()) ||
                user.last_name.toLowerCase().includes(search.toLowerCase())
            );
            console.log(results)
            setFilteredUsers(results);
        } else {
            setFilteredUsers(users); 
        }
    }, [search, users]);

    useEffect(() => {
        fetchUsers(currentPage);
    }, [currentPage]);

    const fetchUsers = async (page) => {
        try {
            const response = await axios.get(`https://reqres.in/api/users?page=${page}`);
            if (updatedUser) {
                const data = response.data.data;
                const index = data.findIndex((user) => user.id === updatedUser.id);
                data.splice(index, 1, updatedUser);
                setUsers(data);
                return;
            }
            setUsers(response.data.data);
        } catch (error) {
            console.error('Error fetching users:', error);
            toast.error('Error fetching users');
        }
    };

    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
    };

    const handleEdit = (user) => {
        const token = localStorage.getItem('token');
        if (!token) {
            toast.error("Please log in to edit user details");
            nav('/');
            return;
        }
        nav('/update', { state: { user } });
    };

    const handleDelete = async (userId) => {
        const token = localStorage.getItem('token');
        if (!token) {
            toast.error("Please log in to delete user");
            nav('/');
            return;
        }
        try {
            await axios.delete(`https://reqres.in/api/users/${userId}`);
            let newArr = users.filter((user) => user.id !== userId);
            setUsers([...newArr]);
            const user = users.find((user) => user.id === userId);
            toast.success(`${user.first_name} is deleted successfully`);
        } catch (error) {
            console.error('Error deleting user:', error);
            toast.error('Error deleting user');
        }
    };

    return (
        <>
            <div className='container'>
                <div className='search-container'>
                    <input className='search-input' type="text" placeholder='Search User...' onChange={(e) => setSearch(e.target.value)} name='search' value={search} />
                </div>
                <h1>Users List</h1>
                <div className='table-wrapper'> {/* Responsive wrapper */}
                    <table className='table'>
                        <thead>
                            <tr>
                                <th>Avatar</th>
                                <th>First Name</th>
                                <th>Last Name</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredUsers.length > 0 ?
                                filteredUsers.map((user) => (
                                    <tr key={user.id}>
                                        <td><img src={user.avatar} alt={`${user.first_name} avatar`} width="50" height="50" /></td>
                                        <td>{user.first_name}</td>
                                        <td>{user.last_name}</td>
                                        <td>
                                            <button onClick={() => handleEdit(user)}>Edit</button>
                                            <button onClick={() => handleDelete(user.id)}>Delete</button>
                                        </td>
                                    </tr>
                                )) :
                                users.map((user) => (
                                    <tr key={user.id}>
                                        <td><img src={user.avatar} alt={`${user.first_name} avatar`} width="50" height="50" /></td>
                                        <td>{user.first_name}</td>
                                        <td>{user.last_name}</td>
                                        <td>
                                            <button onClick={() => handleEdit(user)}>Edit</button>
                                            <button onClick={() => handleDelete(user.id)}>Delete</button>
                                        </td>
                                    </tr>
                                ))
                            }

                        </tbody>
                    </table>
                </div>
                <div className='pagination-buttons'>
                    <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
                        Previous
                    </button>
                    <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === 2}>
                        Next
                    </button>
                </div>
            </div>
        </>
    );
};

export default List;
