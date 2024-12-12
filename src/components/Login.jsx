import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error] = useState(null);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
    
        try {
            const response = await axios.post("http://localhost:5000/auth/login", { username, password });
            localStorage.setItem("token", response.data.token); // Įrašome token į localStorage
            alert("Prisijungimas sėkmingas!");
            navigate("/"); // Nukreipiame į pagrindinį puslapį
        } catch (error) {
            console.error("Prisijungimo klaida:", error);
            alert("Neteisingas vartotojo vardas arba slaptažodis!");
        }
    };
    

    return (
        <div>
            <h2>Prisijungimas</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>} {/* Klaidos pranešimas */}
            <form onSubmit={handleLogin}>
                <div>
                    <label>Vartotojo vardas</label>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Slaptažodis</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <button type="submit">Prisijungti</button>
            </form>
        </div>
    );
};

export default Login;
