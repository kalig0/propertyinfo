export const getLevelCategory = (levelCodes: unknown): string => {
    // Handle cases where levelCodes is not a string or is undefined/null
    if (Array.isArray(levelCodes)) {
      // Join arrays into a single string
      levelCodes = levelCodes.join(',');
    }
  
    if (typeof levelCodes !== 'string') {
      console.error('Invalid level-codes:', levelCodes); // Log unexpected data
      return 'Other';
    }
  
    const code = levelCodes.toLowerCase(); // Ensure it's lowercase for comparison
    console.log('School Level Code:', code);
  
    if (code.includes('h')) return 'High';
    if (code.includes('m')) return 'Middle';
    if (code.includes('e')) return 'Elementary';
  
    return 'Other'; // Default category
  };

export const formatGradeRange = (level: string): string => {
if (!level) return '';
const grades = level.split(',').map((g) => g.trim());
return grades.length > 1 ? `${grades[0]}-${grades[grades.length - 1]}` : grades[0];
};
  