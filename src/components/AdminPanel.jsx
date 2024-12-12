import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AdminPanel = () => {
    const [users, setUsers] = useState([]);
    const [events, setEvents] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            const token = localStorage.getItem('token');
            try {
                const [usersResponse, eventsResponse] = await Promise.all([
                    axios.get('http://localhost:5000/events', {
                        headers: { Authorization: `Bearer ${token}` },
                    }),
                    axios.get('http://localhost:5000/events', {
                        headers: { Authorization: `Bearer ${token}` },
                    }),
                ]);

                setUsers(usersResponse.data);
                setEvents(eventsResponse.data);
            } catch (err) {
                console.error('Klaida gaunant duomenis:', err);
                setError('Nepavyko gauti duomenų');
            }
        };

        fetchData();
    }, []);

    return (
        <div>
            <h2>Administracijos panelė</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}

            <h3>Vartotojai</h3>
            <ul>
                {users.map((user) => (
                    <li key={user.id}>
                        {user.username} - {user.email} ({user.role})
                    </li>
                ))}
            </ul>

            <h3>Renginiai</h3>
            <ul>
                {events.map((event) => (
                    <li key={event.id}>
                        {event.title} - {event.category} - {new Date(event.date).toLocaleString()}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default AdminPanel;
