import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

function EditProfile() {
    const [formData, setFormData] = useState({ rank: '', flightHours: 0 });
    const navigate = useNavigate();
    const { id } = useParams();

    useEffect(() => {
        axios.get(`/api/user/profile/${id}`)
            .then(response => {//gotta add the rest of the values
                setFormData({ rank: response.data.rank, flightHours: response.data.flightHours });
            })
            .catch(error => console.error('Error fetching user data:', error));
    }, [id]);

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        axios.put(`/api/user/profile/${id}`, formData)
            .then(() => {
                alert('Profile updated successfully!');
                navigate('/dashboard');
            })
            .catch(error => console.error('Failed to update profile:', error));
    };

    return (
        <form onSubmit={handleSubmit}>
            <label>Rank:
                <input type="text" name="rank" value={formData.rank} onChange={handleChange} />
            </label>
            <label>Flight Hours:
                <input type="number" name="flightHours" value={formData.flightHours} onChange={handleChange} />
            </label>
            <button type="submit">Update Profile</button>
        </form>
    );
}

export default EditProfile;
S