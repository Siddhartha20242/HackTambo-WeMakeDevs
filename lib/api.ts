import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const getPrediction = async(UserData: {
    user_id: string;
    hour: number;
    day: number;
    last_action: string[];
}) => {
    const response = await api.post('/predict', UserData);
    return response.data;

}


export const recordFeedback = async(feedbackData: {
    user_id: string;
    action_id: string;
    reward: number;
}) => {
    const response = await api.post('/record-feedback', feedbackData);
    return response.data;
}
export default api;















