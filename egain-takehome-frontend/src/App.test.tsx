import { render, fireEvent, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import App from '../src/App';
import * as api from '../src/utils/api';

// Mock the API module
jest.mock('../src/utils/api');

// Cast the API functions as Jest mocks
const mockFetchPropertyInfo = api.fetchPropertyInfo as jest.Mock;
const mockFetchEstimatedValue = api.fetchEstimatedValue as jest.Mock;
const mockFetchNearbySchools = api.fetchNearbySchools as jest.Mock;
const mockFetchChatGptSummary = api.fetchChatGptSummary as jest.Mock;

describe('App Component Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should display an error message for incomplete form submission', async () => {
    render(<App />);
    const submitButton = screen.getByText('Search');

    // Simulate empty form submission
    fireEvent.click(submitButton);

    expect(await screen.findByText('All fields are required. Please fill out the form completely.')).toBeInTheDocument();
  });

  it('should display an error message if property information is missing', async () => {
    mockFetchPropertyInfo.mockRejectedValue(new Error('No property information found.'));

    render(<App />);

    fireEvent.change(screen.getByPlaceholderText('Enter street address'), { target: { value: '1252 Borregas Ave' } });
    fireEvent.change(screen.getByPlaceholderText('Enter city'), { target: { value: 'Sunnyvale' } });
    fireEvent.change(screen.getByDisplayValue('Select State'), { target: { value: 'CA' } });

    const submitButton = screen.getByText('Search');
    fireEvent.click(submitButton);

    expect(await screen.findByText('No property information found.')).toBeInTheDocument();
  });

  it('should display an error message if estimated value cannot be retrieved', async () => {
    const mockProperty = { latitude: 123.456, longitude: -123.456 };
    mockFetchPropertyInfo.mockResolvedValue(mockProperty);
    mockFetchEstimatedValue.mockRejectedValue(new Error('Unable to retrieve estimated property value.'));

    render(<App />);

    fireEvent.change(screen.getByPlaceholderText('Enter street address'), { target: { value: '1252 Borregas Ave' } });
    fireEvent.change(screen.getByPlaceholderText('Enter city'), { target: { value: 'Sunnyvale' } });
    fireEvent.change(screen.getByDisplayValue('Select State'), { target: { value: 'CA' } });

    const submitButton = screen.getByText('Search');
    fireEvent.click(submitButton);

    expect(await screen.findByText('Unable to retrieve estimated property value.')).toBeInTheDocument();
  });

  it('should display an error message if no schools are found', async () => {
    const mockProperty = { latitude: 123.456, longitude: -123.456 };
    const mockValue = { price: 500000 };

    mockFetchPropertyInfo.mockResolvedValue(mockProperty);
    mockFetchEstimatedValue.mockResolvedValue(mockValue);
    mockFetchNearbySchools.mockResolvedValue([]); // No schools found

    render(<App />);

    fireEvent.change(screen.getByPlaceholderText('Enter street address'), { target: { value: '1252 Borregas Ave' } });
    fireEvent.change(screen.getByPlaceholderText('Enter city'), { target: { value: 'Sunnyvale' } });
    fireEvent.change(screen.getByDisplayValue('Select State'), { target: { value: 'CA' } });

    const submitButton = screen.getByText('Search');
    fireEvent.click(submitButton);

    expect(await screen.findByText('No matching schools found in the same city as the property.')).toBeInTheDocument();
  });


  it('should display loading spinner while fetching data', async () => {
    const mockProperty = { latitude: 123.456, longitude: -123.456 };
    mockFetchPropertyInfo.mockResolvedValue(mockProperty);

    render(<App />);

    fireEvent.change(screen.getByPlaceholderText('Enter street address'), { target: { value: '1252 Borregas Ave' } });
    fireEvent.change(screen.getByPlaceholderText('Enter city'), { target: { value: 'Sunnyvale' } });
    fireEvent.change(screen.getByDisplayValue('Select State'), { target: { value: 'CA' } });

    const submitButton = screen.getByText('Search');
    fireEvent.click(submitButton);

    expect(screen.getByText('Loading...')).toBeInTheDocument();
    await waitFor(() => expect(screen.queryByText('Loading...')).not.toBeInTheDocument());
  });

  it('should display the summary after successful form submission', async () => {
    const mockProperty = {
      latitude: 123.456,
      longitude: -123.456,
      yearBuilt: 1995,
      propertyType: 'Single Family',
      squareFootage: 2000,
      lotSize: 5000,
      bedrooms: 3,
      bathrooms: 2,
      features: {
        garageSpaces: 2,
        garageType: 'Attached',
      },
    };
    const mockValue = { price: 500000 };
    const mockSchools = [
      {
        id: 1,
        name: 'Test School',
        city: 'Sunnyvale',
        level: 'Middle',
        'level-codes': ['MS'],
        type: 'Public',
      },
    ];
    const mockSummary = 'This is a beautiful property summary generated by ChatGPT.';

    // Mock API responses
    mockFetchPropertyInfo.mockResolvedValue(mockProperty);
    mockFetchEstimatedValue.mockResolvedValue(mockValue);
    mockFetchNearbySchools.mockResolvedValue(mockSchools);
    mockFetchChatGptSummary.mockResolvedValue(mockSummary);

    render(<App />);

    // Fill out the form
    fireEvent.change(screen.getByPlaceholderText('Enter street address'), {
      target: { value: '1252 Borregas Ave' },
    });
    fireEvent.change(screen.getByPlaceholderText('Enter city'), {
      target: { value: 'Sunnyvale' },
    });
    fireEvent.change(screen.getByLabelText('State:'), {
      target: { value: 'CA' },
    });

    // Submit the form
    const submitButton = screen.getByRole('button', { name: /search/i });
    fireEvent.click(submitButton);

    // Wait for the summary to be displayed
    await waitFor(() =>
      expect(screen.getByTestId('summary')).toHaveTextContent(
        'This is a beautiful property summary generated by ChatGPT.'
      )
    );
  });

});