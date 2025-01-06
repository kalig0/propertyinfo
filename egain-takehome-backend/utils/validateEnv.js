module.exports = () => {
    const requiredVars = ['RENTCAST_API_KEY', 'NEARBYSCHOOLS_API_KEY', 'OPENAI_API_KEY'];
    const missingVars = requiredVars.filter((key) => !process.env[key]);
  
    if (missingVars.length) {
      throw new Error(`Missing required environment variables: ${missingVars.join(', ')}`);
    }
  };
  