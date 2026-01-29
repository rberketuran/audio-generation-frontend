import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const generateMusic = async (requestData) => {
  try {
    const response = await api.post('/api/generate', requestData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const checkStatus = async (jobId) => {
  try {
    const response = await api.get(`/api/status/${jobId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const downloadMusic = async (jobId) => {
  try {
    const response = await api.get(`/api/download/${jobId}`, {
      responseType: 'blob',
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const getCredits = async () => {
  try {
    const response = await api.get('/api/credits');
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Voice Conversion API functions
export const uploadVoiceConversion = async (audioFile, params = {}) => {
  try {
    const formData = new FormData();
    formData.append('audio_file', audioFile);
    formData.append('f0_up_key', params.f0_up_key || 0);
    formData.append('f0_method', params.f0_method || 'rmvpe');
    formData.append('index_rate', params.index_rate || 0.75);
    formData.append('filter_radius', params.filter_radius || 3);
    formData.append('rms_mix_rate', params.rms_mix_rate || 0.25);
    formData.append('protect', params.protect || 0.33);
    formData.append('resample_sr', params.resample_sr || 0);

    const response = await api.post('/api/voice-conversion/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const getVoiceConversionStatus = async (jobId) => {
  try {
    const response = await api.get(`/api/voice-conversion/status/${jobId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const downloadVoiceConversion = async (jobId) => {
  try {
    const response = await api.get(`/api/voice-conversion/download/${jobId}`, {
      responseType: 'blob',
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};
