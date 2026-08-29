import React, { useState } from 'react';

export default function RegisterPage() {
    const [formData, setFormData] = useState({ firstName: '', lastName: '', email: '', password: '' });
    const [message, setMessage] = useState('');

    const handleChange = (event) => {
        setFormData({ ...formData, [event.target.name]: event.target.value });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        const response = await fetch(`${process.env.REACT_APP_BACKEND_URL || ''}/api/auth/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });
        const data = await response.json();
        setMessage(data.message || (response.ok ? 'Registered successfully' : 'Registration failed'));
    };

    return (
        <main>
            <h1>Register</h1>
            <form onSubmit={handleSubmit}>
                <input name="firstName" placeholder="First name" onChange={handleChange} />
                <input name="lastName" placeholder="Last name" onChange={handleChange} />
                <input name="email" type="email" placeholder="Email" onChange={handleChange} required />
                <input name="password" type="password" placeholder="Password" onChange={handleChange} required />
                <button type="submit">Register</button>
            </form>
            {message && <p>{message}</p>}
        </main>
    );
}
