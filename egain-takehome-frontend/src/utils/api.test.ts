import { fetchPropertyInfo, fetchEstimatedValue, fetchNearbySchools, fetchChatGptSummary } from '../../src/utils/api';
import MockAdapter from 'axios-mock-adapter';
import axios from 'axios';

const mockAxios = new MockAdapter(axios);

describe('API Utility Tests', () => {
  afterEach(() => {
    mockAxios.reset();
  });

  describe('fetchPropertyInfo', () => {
    it('should return property information on success', async () => {
      const mockResponse = [{ latitude: 123.456, longitude: -123.456 }];
      mockAxios.onGet('/api/property').reply(200, mockResponse);

      const formData = { street: '1252 Borregas Ave', city: 'Sunnyvale', state: 'CA' };
      const result = await fetchPropertyInfo(formData);

      expect(result).toEqual(mockResponse[0]);
    });

    it('should throw an error if no property information is found', async () => {
      mockAxios.onGet('/api/property').reply(200, []);

      const formData = { street: '1252 Borregas Ave', city: 'Sunnyvale', state: 'CA' };

      await expect(fetchPropertyInfo(formData)).rejects.toThrow('No property information found.');
    });

    it('should handle unexpected Axios errors', async () => {
      mockAxios.onGet('/api/property').reply(500);

      const formData = { street: '1252 Borregas Ave', city: 'Sunnyvale', state: 'CA' };

      await expect(fetchPropertyInfo(formData)).rejects.toThrow('No property information for this address.');
    });
  });

  describe('fetchEstimatedValue', () => {
    it('should return estimated value on success', async () => {
      const mockResponse = { price: 500000 };
      mockAxios.onGet('/api/value').reply(200, mockResponse);

      const result = await fetchEstimatedValue(37.7749, -122.4194);

      expect(result).toEqual(mockResponse);
    });

    it('should throw an error if no estimated value is found', async () => {
      mockAxios.onGet('/api/value').reply(200, {});

      await expect(fetchEstimatedValue(37.7749, -122.4194)).rejects.toThrow('Unable to retrieve estimated property value.');
    });

    it('should handle unexpected Axios errors', async () => {
      mockAxios.onGet('/api/value').reply(500);

      await expect(fetchEstimatedValue(37.7749, -122.4194)).rejects.toThrow('No estimated value for this address.');
    });
  });

  describe('fetchNearbySchools', () => {
    it('should return nearby schools on success', async () => {
      const mockResponse = { schools: [{ name: 'Test School', distance: 1.2 }] };
      mockAxios.onGet('/api/schools').reply(200, mockResponse);

      const result = await fetchNearbySchools(37.7749, -122.4194);

      expect(result).toEqual(mockResponse.schools);
    });

    it('should throw an error if no nearby schools are found', async () => {
      mockAxios.onGet('/api/schools').reply(200, { schools: [] });

      await expect(fetchNearbySchools(37.7749, -122.4194)).rejects.toThrow('No nearby schools found.');
    });

    it('should handle unexpected Axios errors', async () => {
      mockAxios.onGet('/api/schools').reply(500);

      await expect(fetchNearbySchools(37.7749, -122.4194)).rejects.toThrow('No nearby schools for this address.');
    });
  });

  describe('fetchChatGptSummary', () => {
    it('should return a summary on success', async () => {
      const mockResponse = {
        choices: [
          {
            message: {
              content: 'This is a beautiful property located in Sunnyvale.',
            },
          },
        ],
      };
      mockAxios.onPost('/api/chatgpt').reply(200, mockResponse);

      const propertyDetails = {
        street: '1252 Borregas Ave',
        city: 'Sunnyvale',
        state: 'CA',
        estimatedValue: 500000,
        yearBuilt: 1990,
        propertyType: 'Single Family',
        houseSize: 1500,
        lotSize: 5000,
        bedrooms: 3,
        bathrooms: 2,
        garageSpaces: 2,
        garageType: 'Attached',
      };
      const result = await fetchChatGptSummary(propertyDetails);

      expect(result).toBe(mockResponse.choices[0].message.content.trim());
    });

    it('should throw an error if no summary is generated', async () => {
      mockAxios.onPost('/api/chatgpt').reply(200, {});

      const propertyDetails = {
        street: '1252 Borregas Ave',
        city: 'Sunnyvale',
        state: 'CA',
        estimatedValue: 500000,
        yearBuilt: 1990,
        propertyType: 'Single Family',
        houseSize: 1500,
        lotSize: 5000,
        bedrooms: 3,
        bathrooms: 2,
        garageSpaces: 2,
        garageType: 'Attached',
      };

      await expect(fetchChatGptSummary(propertyDetails)).rejects.toThrow('Failed to generate a property summary.');
    });

  });
});
