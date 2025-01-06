module.exports = {
    jest: (config) => {
      // Let Axios ESM be transformed by Babel
      config.transformIgnorePatterns = [
        '/node_modules/(?!axios)', 
      ];
      return config;
    },
  };
  