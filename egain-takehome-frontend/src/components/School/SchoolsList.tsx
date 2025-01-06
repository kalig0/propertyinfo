import React from 'react';
import SchoolItem from './SchoolItem';
import { School } from '../../types';

interface SchoolsListProps {
  groupedSchools: {
    [category: string]: {
      Public: School[];
      Private: School[];
    };
  };
  formatGradeRange: (level: string) => string;
}

const SchoolsList: React.FC<SchoolsListProps> = ({ groupedSchools, formatGradeRange }) => (
  <div>
    <h2>Nearby Schools</h2>
    <ul>
      {Object.entries(groupedSchools).map(([category, types]) => (
        <li key={category}>
          <strong>{category} Schools</strong>
          <ul>
            {types.Public.map((school) => (
              <SchoolItem key={school.name} school={school} formatGradeRange={formatGradeRange} />
            ))}
            {types.Private.map((school) => (
              <SchoolItem key={school.name} school={school} formatGradeRange={formatGradeRange} />
            ))}
          </ul>
        </li>
      ))}
    </ul>
  </div>
);

export default SchoolsList;
