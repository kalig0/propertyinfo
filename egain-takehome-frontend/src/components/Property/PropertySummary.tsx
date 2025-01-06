import React from 'react';

interface PropertySummaryProps {
  summary: string | null;
  error: string | null;
}

const PropertySummary: React.FC<PropertySummaryProps> = ({ summary, error }) => {
  if (error) {
    return (
      <div style={{ color: 'red', marginTop: '1rem', padding: '1rem', border: '1px solid red', borderRadius: '5px' }}>
        <strong>Error:</strong> {error}
      </div>
    );
  }

  if (!summary) return null;

  return (
    <div>
      <h2>Property Summary</h2>
      <p data-testid="summary">{summary}</p>
    </div>
  );
};


export default PropertySummary;
