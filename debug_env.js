const dotenv = require('dotenv');
dotenv.config();

const key = process.env.OPENAI_API_KEY;
const forge = process.env.BUILT_IN_FORGE_API_KEY;

console.log('OPENAI_API_KEY tipo:', typeof key);
console.log('OPENAI_API_KEY length:', key ? key.length : 0);
console.log('OPENAI_API_KEY raw:', JSON.stringify(key));
console.log('BUILT_IN_FORGE_API_KEY raw:', JSON.stringify(forge));

const result = forge ?? key ?? '';
console.log('resultado ?? :', JSON.stringify(result));
console.log('resultado bool:', !!result);
