export interface School {
    name: string;
    type: string;
    'level-codes': string;
    level: string;
    distance?: number;
    city?: string;
    rating_band: string;
    street: string;
}

// Address input from the form
export interface FormData {
    street: string;
    city: string;
    state: string;
}
  
// Property information returned from the API
export interface Property {
    latitude: number;
    longitude: number;
    squareFootage: number;
    lotSize: number;
    propertyType: string;
    yearBuilt: number;
    features?: {
      garageSpaces?: number;
      garageType?: string;
    };
    bedrooms: number;
    bathrooms: number;
}
  
// Property details passed to ChatGPT
export interface PropertyDetails {
    street: string;
    city: string;
    state: string;
    estimatedValue: number;
    yearBuilt: number;
    propertyType: string;
    houseSize: number;
    lotSize: number;
    bedrooms: number;
    bathrooms: number;
    garageSpaces: number;
    garageType: string;
}
  