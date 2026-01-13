const { default: axios } = require('axios');


const sendEmail = async (options) => {
    try {
        const res = await axios.post("https://n8n.srv1234562.hstgr.cloud/webhook/05b95207-f016-4fde-9030-fb6b332c8856", options);
        console.log(res.data);
        if (res.status !== 200) {
            throw new Error('Email could not be sent');
        }

    } catch (error) {
        console.error('Send Email Utility Error:', error.message);
        if (error.response) {
            console.error('N8N Response Status:', error.response.status);
            console.error('N8N Response Data:', error.response.data);
        }
        throw new Error(error.message || 'Email could not be sent');
    }
};

module.exports = sendEmail;
