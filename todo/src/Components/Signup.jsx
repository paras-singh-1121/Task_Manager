import React, { useState } from 'react';
import API from '../api';
import { useNavigate } from 'react-router-dom';

function Signup() {
    const [form, setForm] = useState({ name: '', email: '', password: '' });
    const navigate = useNavigate();

    const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async e => {
        e.preventDefault();
        await API.post('/signup', form);
        navigate('/login');
    };

    return (
        <div className="container d-flex justify-content-center align-items-center min-vh-100">
    <div className="card p-4 shadow" style={{ width: '100%', maxWidth: '400px' }}>
        <h2 className="text-center mb-4">Signup</h2>
        <form onSubmit={handleSubmit}>
            <div className="mb-3">
                <input
                    type="text"
                    name="name"
                    placeholder="Name"
                    className="form-control"
                    onChange={handleChange}
                    required
                />
            </div>
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
            <button className="btn btn-primary w-100">Signup</button>
        </form>
    </div>
</div>

    );
}

export default Signup;
