import axios from 'axios';

const getBaseUrl = function(env) {
  const envs = {
    development: 'http://localhost:8000/',
    staging: '/',
    production: '/',
  };

  return envs[env] || '/';
};

export default axios.create({
  baseURL: getBaseUrl(process.env.NODE_ENV),
});
