import axios from 'axios';

const servicoAPI = axios.create({
	baseURL: import.meta.env.VITE_API_URL,
});

export default servicoAPI;
