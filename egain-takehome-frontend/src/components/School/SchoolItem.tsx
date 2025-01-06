import React from 'react';
import { School } from '../../types';

interface SchoolItemProps {
  school: School;
  formatGradeRange: (level: string) => string;
}

const SchoolItem: React.FC<SchoolItemProps> = ({ school, formatGradeRange }) => (
  <li>
    {school.name} ({school.distance?.toFixed(1) || 'N/A'} miles away)
    • Grades: {formatGradeRange(school.level)}
    &nbsp;
    • Rating: {school.rating_band || 'N/A'}
  </li>
);

export default SchoolItem;
