const express = require('express')
const router = express.Router()


// In-memory database to store domain/IP mappings
const domainMap = new Map();

// Endpoint to update DNS records from the router
router.post('/update', (req, res) => {
  const hostname = req.query.hostname;
  const ip = req.query.ip;
    console.log('----hostname and ip ------')
    console.log(ip)
    console.log(hostname)
    console.log('-----------------requset----------------')
    console.log(req)
  // Verify the provided credentials (optional)
//   const username = req.query.username;
//   const password = req.query.password;
  // Perform authentication checks here, if required

  // Store the domain/IP mapping in the database
  domainMap.set(hostname, ip);

  res.send('DNS record updated successfully');
});

// DNS resolution endpoint
router.get('/dns', (req, res) => {
  const domain = req.query.domain;

  // Check if the domain exists in the database
  if (domainMap.has(domain)) {
    const ip = domainMap.get(domain);
    res.json({ domain: domain, ip: ip });
  } else {
    res.status(404).json({ error: 'Domain not found' });
  }
});

// Helper function to generate a random domain name
function generateRandomDomain() {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let domain = '';
  for (let i = 0; i < 10; i++) {
    const randomIndex = Math.floor(Math.random() * chars.length);
    domain += chars[randomIndex];
  }
  return `${domain}.example.com`;
}

module.exports = router