import axios from "axios";

const sendMessageToGPT = async (user_prompt) => {
    try {
        const apiEndpoint = 'https://api.openai.com/v1/chat/completions';
        const apiKey = import.meta.env.VITE_OPENAI_API

        const conversation = {
            messages: [
                { role: 'user', content: user_prompt },
            ],
        };

        const headers = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`,
        };

        const requestBody = {
            model: 'gpt-3.5-turbo-0613',
            messages: conversation.messages,
        };

        const response = await axios.post(apiEndpoint, requestBody, { headers });

        // Handle the response as needed
        console.log(response.data.choices[0].message.content)
        return response.data.choices[0].message.content

    } catch (error) {
        console.error('Error making API request:', error);
    }
};


export {sendMessageToGPT}