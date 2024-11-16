import axios from 'axios'
const REACT_APP_BASE_URL="https://oabss-nl7b.onrender.com" ;

export const axiosi=axios.create({withCredentials:true,baseURL:REACT_APP_BASE_URL})
