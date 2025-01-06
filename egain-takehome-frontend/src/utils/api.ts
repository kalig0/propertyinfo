import axios from 'axios';

export const fetchPropertyInfo = async (formData: any) => {
    try {
      const response = await axios.get('/api/property', {
        params: {
          address: formData.street, // Map `street` to `address`
          city: formData.city,
          state: formData.state,
        },
        paramsSerializer: (params) => {
          const queryString = Object.keys(params)
            .map((key) => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
            .join('&');
          console.log('Encoded Query String:', queryString); // Debugging
          return queryString;
        },
      });
  
      if (!response.data || response.data.length === 0) {
        throw new Error('No property information found.');
      }
  
      console.log('Property Info Response:', response.data[0]);
      return response.data[0];
    } catch (err: any) {
      if (axios.isAxiosError(err)) {
        console.error('Axios Error in fetchPropertyInfo:', err);
        if (err.response) {
          throw new Error(`No property information for this address.`);
        } else if (err.request) {
          throw new Error('No response received from the Property API.');
        } else {
          throw new Error(`Unexpected error in Property API: ${err.message}`);
        }
      }
      throw err; // Re-throw non-Axios errors
    }
};
  

export const fetchEstimatedValue = async (latitude: number, longitude: number) => {
    try {
      const response = await axios.get('/api/value', { params: { latitude, longitude } });
  
      if (!response.data || !response.data.price) {
        throw new Error('Unable to retrieve estimated property value.');
      }
  
      console.log('Estimated Value Response:', response.data);
      return response.data;
    } catch (err: any) {
      if (axios.isAxiosError(err)) {
        console.error('Axios Error in fetchEstimatedValue:', err);
        if (err.response) {
          throw new Error(`No estimated value for this address.`);
        } else if (err.request) {
          throw new Error('No response received from the Estimated Value API.');
        } else {
          throw new Error(`Unexpected error in Estimated Value API: ${err.message}`);
        }
      }
      throw err; // Re-throw non-Axios errors
    }
};
  

export const fetchNearbySchools = async (latitude: number, longitude: number) => {
    try {
      const response = await axios.get('/api/schools', { params: { lat: latitude, lon: longitude } });
  
      if (!response.data || !response.data.schools || response.data.schools.length === 0) {
        throw new Error('No nearby schools found.');
      }
  
      console.log('Nearby Schools Response:', response.data.schools);
      return response.data.schools;
    } catch (err: any) {
      if (axios.isAxiosError(err)) {
        console.error('Axios Error in fetchNearbySchools:', err);
        if (err.response) {
          throw new Error(`No nearby schools for this address.`);
        } else if (err.request) {
          throw new Error('No response received from the Nearby Schools API.');
        } else {
          throw new Error(`Unexpected error in Nearby Schools API: ${err.message}`);
        }
      }
      throw err; // Re-throw non-Axios errors
    }
};
  

export const fetchChatGptSummary = async (propertyDetails: any) => {
    try {
      // Construct the user message
      const userMessage = {
        role: 'user',
        content: `
          Tell me about the property at this address:
          - Street: ${propertyDetails.street}
          - City: ${propertyDetails.city}
          - State: ${propertyDetails.state}
          - Estimated Value: ${propertyDetails.estimatedValue}
          - Year Built: ${propertyDetails.yearBuilt}
          - Property Type: ${propertyDetails.propertyType}
          - House Size: ${propertyDetails.houseSize} sqft
          - Lot Size: ${propertyDetails.lotSize} sqft
          - Bedrooms: ${propertyDetails.bedrooms}
          - Bathrooms: ${propertyDetails.bathrooms}
          - Garage Space: ${propertyDetails.garageSpaces} cars
          - Garage Type: ${propertyDetails.garageType}
        `,
      };
  
      // Construct the full payload
      const payload = {
        messages: [
          {
            role: 'system',
            content: 'You are a helpful assistant that summarizes property information.',
          },
          userMessage,
        ],
      };
  
      console.log('ChatGPT Request Payload:', payload);
  
      // Send the request
      const response = await axios.post('/api/chatgpt', payload);
  
      if (!response.data || !response.data.choices || response.data.choices.length === 0) {
        throw new Error('Failed to generate a property summary.');
      }
  
      console.log('ChatGPT Summary Response:', response.data.choices[0].message.content);
      return response.data.choices[0].message.content.trim();
    } catch (err: any) {
      if (axios.isAxiosError(err)) {
        console.error('Axios Error in fetchChatGptSummary:', err);
        if (err.response) {
          throw new Error(`ChatGPT API error: ${err.response.status} - ${err.response.statusText}`);
        } else if (err.request) {
          throw new Error('No response received from the ChatGPT API.');
        } else {
          throw new Error(`Unexpected error in ChatGPT API: ${err.message}`);
        }
      }
      throw err; // Re-throw non-Axios errors
    }
};
  
