// require('dotenv').config();

// const cors = require('cors');
// const morgan = require('morgan');
// const express = require('express');
// const dns = require('dns');
// const http = require('http');

// const app = express();
// app.use(cors({
//     "origin": "*",
//     "methods": "GET,HEAD,PUT,PATCH,POST,DELETE",
//     "preflightContinue": false,
//     "optionsSuccessStatus": 204,
//     "credentials":true,
//   })); //specify later the url of the deployed frontend project

//   app.use(express.json());
// app.use(morgan("tiny"));

// app.post('/checkIP',(req,res)=>{
//     const { ip } = req.body
//     dns.lookup('iphost1000.ddns.net', (err, address, family) => {
//         console.log('address: %j family: IPv%s', address, family);
//         if(address == ip){

//             res.status(200).json({msg:'The public ip matches the one on the server'})
//         }
//         else{
//             res.status(200).json({msg:'The public ip does not match the one on the server'})
//         }
//     });
// })

// app.get('/',(req,res)=>{
//     res.status(200).json({msg:'Test Server'})
// })

// app.use('/dnsService',require('./routes/dnsService'))

// const startServer = async ()=>{
//     try {
//         app.listen(process.env.SERVERPORT,()=>{
//             console.log(`The server is now running on port: ${process.env.SERVERPORT}`)
//         })
//     } catch (error) {  
//         console.log(error)
//     }
// }
// startServer()
const express = require('express');
const dnsd = require('dnsd');
const app = express();
const dnsPort = 54;
const apiPort = 3000;

// In-memory database to store domain-to-IP mappings
const domainMap = new Map();

// DNS server
dnsd.createServer((req, res) => {
  const question = res.question[0];
  const { name } = question;

  if (question.type === 'A' && domainMap.has(name)) {
    const ip = domainMap.get(name);
    res.answer.push({ name, type: 'A', data: ip, ttl: 300 });
  }

  res.end();
}).listen(dnsPort, () => {
  console.log(`DNS server listening on port ${dnsPort}`);
});

// API endpoint for updating DNS records
app.post('/update', (req, res) => {
  const { domain, ip } = req.body;

  // Update the IP address for the domain in the database
  domainMap.set(domain, ip);

  res.json({ success: true });
});

// Start the API server
app.listen(apiPort, () => {
  console.log(`API server listening on port ${apiPort}`);
});
