import axios from 'axios';


// main sideabr api
const API_URL = 'http://127.0.0.1:9000/api/';

export const fetchSidebarData = async () => {
    try {
        const response = await axios.get(API_URL);
        return response.data;
    } catch (error) {
        console.error('Error fetching sidebar data:', error);
        throw error;
    }
};


// new left sidebar
const API_NEWURL = 'http://127.0.0.1:9000/newsidebar/';
export const fetchNewSidebarData = async ()=>{
    try {
        const response = await axios.get(API_NEWURL);
        return response.data;
    } catch (error) {
        console.error('Error fetching sidebar data:', error);
        throw error;
    }
};
