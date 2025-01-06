import React, { useState } from 'react';
import AddressForm from './components/Form/AddressForm';
import PropertySummary from './components/Property/PropertySummary';
import SchoolsList from './components/School/SchoolsList';
import { fetchPropertyInfo, fetchEstimatedValue, fetchNearbySchools, fetchChatGptSummary } from './utils/api';
import { formatGradeRange, getLevelCategory } from './utils/helpers';
import { School } from './types';

const states = [
  { value: "AL", label: "AL" },
  { value: "AK", label: "AK" },
  { value: "AZ", label: "AZ" },
  { value: "AR", label: "AR" },
  { value: "CA", label: "CA" },
  { value: "CO", label: "CO" },
  { value: "CT", label: "CT" },
  { value: "DC", label: "DC" },
  { value: "DE", label: "DE" },
  { value: "FL", label: "FL" },
  { value: "GA", label: "GA" },
  { value: "HI", label: "HI" },
  { value: "ID", label: "ID" },
  { value: "IL", label: "IL" },
  { value: "IN", label: "IN" },
  { value: "IA", label: "IA" },
  { value: "KS", label: "KS" },
  { value: "KY", label: "KY" },
  { value: "LA", label: "LA" },
  { value: "ME", label: "ME" },
  { value: "MD", label: "MD" },
  { value: "MA", label: "MA" },
  { value: "MI", label: "MI" },
  { value: "MN", label: "MN" },
  { value: "MS", label: "MS" },
  { value: "MO", label: "MO" },
  { value: "MT", label: "MT" },
  { value: "NE", label: "NE" },
  { value: "NV", label: "NV" },
  { value: "NH", label: "NH" },
  { value: "NJ", label: "NJ" },
  { value: "NM", label: "NM" },
  { value: "NY", label: "NY" },
  { value: "NC", label: "NC" },
  { value: "ND", label: "ND" },
  { value: "OH", label: "OH" },
  { value: "OK", label: "OK" },
  { value: "OR", label: "OR" },
  { value: "PA", label: "PA" },
  { value: "RI", label: "RI" },
  { value: "SC", label: "SC" },
  { value: "SD", label: "SD" },
  { value: "TN", label: "TN" },
  { value: "TX", label: "TX" },
  { value: "UT", label: "UT" },
  { value: "VT", label: "VT" },
  { value: "VA", label: "VA" },
  { value: "WA", label: "WA" },
  { value: "WV", label: "WV" },
  { value: "WI", label: "WI" },
  { value: "WY", label: "WY" },
];

interface GroupedSchools {
  [category: string]: {
    Public: School[];
    Private: School[];
  };
}

const App: React.FC = () => {
  const [formData, setFormData] = useState({
    street: '',
    city: '',
    state: '',
  });

  const [summary, setSummary] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // We'll store the fetched schools in state
  const [schoolsList, setSchoolsList] = useState<School[]>([]);

  // This boolean tracks if at least one property search has happened
  const [hasSearched, setHasSearched] = useState<boolean>(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

      // Validate input fields
    if (!formData.street || !formData.city || !formData.state) {
      setError('All fields are required. Please fill out the form completely.');
      return;
  }

    setError(null); // Clear previous errors
    setSummary(null);
    setSchoolsList([]);
    setHasSearched(false);
    setIsLoading(true);
  
    try {
      // Step 1: Fetch property information
      const property = await fetchPropertyInfo(formData);
  
      // Step 2: Fetch estimated value
      const value = await fetchEstimatedValue(property.latitude, property.longitude);
  
      // Step 3: Fetch nearby schools
      const schools = await fetchNearbySchools(property.latitude, property.longitude);
  
      // Filter schools based on city and grade level
      const filteredSchools = schools
        .filter((school: School) => school.city?.toLowerCase() === formData.city.toLowerCase())
        .filter((school: School) => school.level?.toUpperCase() !== 'UG');
  
      if (filteredSchools.length === 0) {
        throw new Error('No matching schools found in the same city as the property.');
      }
  
      // Step 4: Fetch ChatGPT summary
      const summary = await fetchChatGptSummary({
        street: formData.street,
        city: formData.city,
        state: formData.state,
        estimatedValue: value.price,
        yearBuilt: property.yearBuilt,
        propertyType: property.propertyType,
        houseSize: property.squareFootage,
        lotSize: property.lotSize,
        bedrooms: property.bedrooms,
        bathrooms: property.bathrooms,
        garageSpaces: property.features?.garageSpaces ?? 0,
        garageType: property.features?.garageType ?? 'N/A',
      });
  
      // Update state with fetched data
      setSummary(summary);
      setSchoolsList(filteredSchools);
      setHasSearched(true);
    } catch (err: any) {
      console.error('Error in handleSubmit:', err);
  
      // Display the error message
      setError(err.message || 'An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false); // Stop loading spinner
    }
  };
  

  const groupedSchools: GroupedSchools = schoolsList.reduce<GroupedSchools>(
    (acc, school) => {
      const category = getLevelCategory(school['level-codes']); // Categorize schools (e.g., "Elementary")
      const type = school.type.toLowerCase() === 'private' ? 'Private' : 'Public'; // Determine type
  
      // Ensure the category exists in the accumulator
      if (!acc[category]) {
        acc[category] = { Public: [], Private: [] };
      }
  
      // Add the school to the appropriate subcategory
      acc[category][type].push(school);
  
      return acc;
    },
    {
      Elementary: { Public: [], Private: [] },
      Middle: { Public: [], Private: [] },
      High: { Public: [], Private: [] },
    }
  );
  

  return (
    <div className="mt-4 p-4 rounded-md">
      <h1>Residential Property Lookup</h1>
      <AddressForm
        formData={formData}
        states={states}
        isLoading={isLoading}
        onChange={handleChange}
        onSubmit={handleSubmit}
      />
      <PropertySummary summary={summary} error={error} />
      {hasSearched && schoolsList.length > 0 && (
        <SchoolsList groupedSchools={groupedSchools} formatGradeRange={formatGradeRange} />
      )}
    </div>
  );
};
export default App;
