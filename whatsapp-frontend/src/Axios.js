import axios from 'axios'


const instance = axios.create({
    baseURL:'https://whatsapp-mern-backend-koustav.herokuapp.com/',
})

export default instance;