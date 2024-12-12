import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';


const Navbar = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('token'); // Išvalome prisijungimo token
        alert('Jūs atsijungėte sėkmingai!');
        navigate('/login'); // Peradresuojame į prisijungimo puslapį
    };

    const token = localStorage.getItem('token');
    const isLoggedIn = !!token;
    let isAdmin = false;

    if (token) {
        try {
            const decoded = jwtDecode(token);
            isAdmin = decoded.role === 'admin'; // Tikriname rolę
        } catch (err) {
            console.error('Klaida dekoduojant token:', err);
        }
    }

    return (
        <nav>
            <ul>
                <li><Link to="/">Renginiai</Link></li>
                {!isLoggedIn ? (
                    <>
                        <li><Link to="/register">Registracija</Link></li>
                        <li><Link to="/login">Prisijungimas</Link></li>
                    </>
                ) : (
                    <>
                        {isAdmin && (
                            <li><Link to="/admin">Administracija</Link></li>
                        )}
                        <li>
                            <button onClick={handleLogout} style={{ cursor: 'pointer', background: 'none', border: 'none', color: 'blue', textDecoration: 'underline' }}>
                                Atsijungti
                            </button>
                        </li>
                    </>
                )}
            </ul>
        </nav>
    );
};

export default Navbar;
