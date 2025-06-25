import React, { useState } from 'react';
import API from '../api';
import { useNavigate } from 'react-router-dom';

function Login() {
    const [form, setForm] = useState({ email: '', password: '' });
    const navigate = useNavigate();
    
    const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async e => {
        e.preventDefault();
        const res = await API.post('/login', form);
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('userId', res.data.userId);
        console.log(res);

        navigate('/dashboard');
    };

    return (
        <div className="container d-flex justify-content-center align-items-center min-vh-100">
    <div className="card p-4 shadow" style={{ width: '100%', maxWidth: '400px' }}>
        <h2 className="text-center mb-4">Login</h2>
        <form onSubmit={handleSubmit}>
            <div className="mb-3">
                <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    className="form-control"
                    onChange={handleChange}
                    required
                />
            </div>
            <div className="mb-3">
                <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    className="form-control"
                    onChange={handleChange}
                    required
                />
            </div>
            <button className="btn btn-primary w-100">Login</button>
        </form>
    </div>
</div>

    );
}

export default Login;
