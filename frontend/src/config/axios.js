import axios from 'axios'
const REACT_APP_BASE_URL="https://oabss.vercel.app/?vercelToolbarCode=0cypGHpFq6bFpuc" ;

export const axiosi=axios.create({withCredentials:true,baseURL:REACT_APP_BASE_URL})
