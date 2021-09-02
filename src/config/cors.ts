import cors from 'cors';
import env from './env';

const allowlist: any[string] = env.ALLOW_CORS_DOMAIN;
const corsOptionsDelegate = (req: any, callback: any) => {
  let corsOptions;
  if (allowlist.indexOf(req.header('Origin')) !== -1) {
    corsOptions = { origin: true }; // reflect (enable) the requested origin in the CORS response
  } else {
    corsOptions = { origin: false }; // disable CORS for this request
  }

  callback(null, corsOptions); // callback expects two parameters: error and options
};

export default cors(corsOptionsDelegate);
