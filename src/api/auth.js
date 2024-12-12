const axios = require('axios');

const API_URL = "http://localhost:5000/auth";

const login = (credentials) => {
    return axios.post(`${API_URL}/login`, credentials);
};

const register = (data) => {
    return axios.post(`${API_URL}/register`, data);
};

module.exports = { login, register };
