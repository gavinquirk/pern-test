import arcjet, { tokenBucket, shield, detectBot } from '@arcjet/node';

import 'dotenv/config';

export const aj = arcjet({
  key: process.env.ARCJET_KEY,
  characteristics: ['ip.src'],
  rules: [
    // Shield protects from common attacks like DDoS, brute-force, and credential stuffing
    shield({ mode: 'LIVE' }), // Enable Shield in LIVE mode
    // Token Bucket rate limiter allows 100 requests per minute with a burst of 20
    tokenBucket({
      mode: 'LIVE',
      refillRate: 5,
      interval: 10,
      capacity: 10,
    }), // Enable Token Bucket in LIVE mode
    // Detect and block bots except search engine crawlers
    detectBot({
      mode: 'LIVE',
      allow: ['CATEGORY:ACADEMIC', 'CATEGORY:SEARCH_ENGINE'],
    }), // Enable Bot Detection in LIVE mode
  ],
});
