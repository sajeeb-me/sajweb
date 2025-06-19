"use strict";
require('dotenv').config();
console.log('Environment variables loaded:' + JSON.stringify(process.env, null, 2));
console.log(process.env.CLAUDE_API_KEY);
