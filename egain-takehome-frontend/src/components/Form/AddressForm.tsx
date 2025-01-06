import React from 'react';

interface AddressFormProps {
  formData: { street: string; city: string; state: string; };
  states: { value: string; label: string }[];
  isLoading: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
}

const AddressForm: React.FC<AddressFormProps> = ({ formData, states, isLoading, onChange, onSubmit }) => (
  <form onSubmit={onSubmit}>
    <div className="flex gap-2">
      <div>
        <label htmlFor='street-input'>Street:</label>
        <input
          type="text"
          id="street-input"
          name="street"
          placeholder='Enter street address'
          value={formData.street}
          onChange={onChange}
          required
        />
      </div>
      <div>
        <label htmlFor='city-input'>City:</label>
        <input
          type="text"
          id="city-input"
          name="city"
          placeholder='Enter city'
          value={formData.city}
          onChange={onChange}
          required
        />
      </div>
      <div>
        <label htmlFor="state-select">State:</label>
        <select id="state-select" name="state" value={formData.state} onChange={onChange} required>
          <option value="" disabled>
            Select State
          </option>
          {states.map((state) => (
            <option key={state.value} value={state.value}>
              {state.label}
            </option>
          ))}
        </select>
      </div>
      <button type="submit" disabled={isLoading}>
        {isLoading ? 'Loading...' : 'Search'}
      </button>      
    </div>

  </form>
);

export default AddressForm;
