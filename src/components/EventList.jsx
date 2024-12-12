import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';

const EventList = () => {
    const [events, setEvents] = useState([]);
    const [filters, setFilters] = useState({ category: '', startDate: '', endDate: '' });
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false); // Kraunama būsena

    const fetchEvents = useCallback(async () => {
        setLoading(true); // Rodome krovimo indikatoriu
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                setError("Prisijungimas reikalingas. Token nerastas.");
                setLoading(false);
                return;
            }

            const response = await axios.get("http://localhost:5000/events", {
                headers: { Authorization: `Bearer ${token}` },
            }); 

            setEvents(response.data); // Saugojame gautus renginius
            setError(null); // Klaidos pranešimai išvalomi
        } catch (err) {
            console.error("Klaida gaunant renginius:", err);

            // Tvarkome klaidos būseną pagal atsakymo statusą
            if (err.response?.status === 403) {
                setError("Prieiga uždrausta. Patikrinkite savo prisijungimo duomenis.");
            } else if (err.response?.status === 500) {
                setError("Serverio klaida. Bandykite dar kartą vėliau.");
            } else {
                setError("Nepavyko gauti renginių. Bandykite dar kartą.");
            }
        } finally {
            setLoading(false); // Paslepiame krovimo indikatoriu
        }
    }, []);

    useEffect(() => {
        fetchEvents();
    }, [fetchEvents]);

    const handleFilterChange = (e) => {
        setFilters({ ...filters, [e.target.name]: e.target.value });
    };

    const handleFilterSubmit = (e) => {
        e.preventDefault();
        fetchEvents();
    };

    const rateEvent = async (id) => {
        const rating = prompt('Įveskite įvertinimą (1-5):');
        if (!rating || rating < 1 || rating > 5) {
            alert('Įvertinimas turi būti tarp 1 ir 5.');
            return;
        }

        try {
            await axios.post(`http://localhost:5000/events/rate/${id}`, { rating });
            alert('Renginys sėkmingai įvertintas!');
            fetchEvents();
        } catch (err) {
            console.error('Klaida vertinant renginį:', err);
            setError('Nepavyko įvertinti renginio. Bandykite dar kartą.');
        }
    };

    return (
        <div>
            <h2>Renginiai</h2>

            {/* Rodome krovimo indikatoriu */}
            {loading && <p>Įkeliama...</p>}

            {/* Klaidos pranešimas, jei nepavyksta gauti renginių */}
            {error && <p style={{ color: 'red' }}>{error}</p>}

            {/* Filtrų forma */}
            <form onSubmit={handleFilterSubmit} style={{ marginBottom: '20px' }}>
                <div style={{ marginBottom: '10px' }}>
                    <label>Kategorija:</label>
                    <select name="category" value={filters.category} onChange={handleFilterChange}>
                        <option value="">Visos</option>
                        <option value="Music">Muzika</option>
                        <option value="Sport">Sportas</option>
                        <option value="Art">Menai</option>
                    </select>
                </div>
                <div style={{ marginBottom: '10px' }}>
                    <label>Pradžios data:</label>
                    <input
                        type="date"
                        name="startDate"
                        value={filters.startDate}
                        onChange={handleFilterChange}
                    />
                </div>
                <div style={{ marginBottom: '10px' }}>
                    <label>Pabaigos data:</label>
                    <input
                        type="date"
                        name="endDate"
                        value={filters.endDate}
                        onChange={handleFilterChange}
                    />
                </div>
                <button type="submit" disabled={loading}>
                    Filtruoti
                </button>
            </form>

            {/* Renginių sąrašas */}
            <div>
                {!loading && events.length === 0 && !error && (
                    <p>Nėra renginių pagal pasirinktus kriterijus.</p>
                )}
                {events.map((event) => (
                    <div
                        key={event.id}
                        style={{
                            border: '1px solid #ccc',
                            padding: '10px',
                            margin: '10px 0',
                            borderRadius: '5px',
                            boxShadow: '0 0 5px rgba(0, 0, 0, 0.1)',
                        }}
                    >
                        <h3>{event.title}</h3>
                        <p>
                            <strong>Kategorija:</strong> {event.category}
                        </p>
                        <p>
                            <strong>Data:</strong> {new Date(event.date).toLocaleString()}
                        </p>
                        <p>
                            <strong>Vieta:</strong> {event.location}
                        </p>
                        <button onClick={() => rateEvent(event.id)}>Įvertinti</button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default EventList;
