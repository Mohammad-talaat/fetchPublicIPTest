require('dotenv').config();

const cors = require('cors');
const morgan = require('morgan');
const express = require('express');
const dns = require('dns');

const app = express();
app.use(cors({
    
    "origin": "*",
    "methods": "GET,HEAD,PUT,PATCH,POST,DELETE",
    "preflightContinue": false,
    "optionsSuccessStatus": 204,
    "credentials":true,
    // 
  })); //specify later the url of the deployed frontend project

  app.use(express.json());
app.use(morgan("tiny"));

app.post('/checkIP',(req,res)=>{
    const { ip } = req.body

    dns.lookup('iphost1000.ddns.net', (err, address, family) => {
        console.log('address: %j family: IPv%s', address, family);
        if(address == ip){

            res.status(200).json({msg:'The public ip matches the one on the server'})
        }
        else{
            res.status(400).json({msg:'The public ip does not match the one on the server'})
        }
    });
})

app.get('/',(req,res)=>{
    res.status(200).json({msg:'Test Server'})
})

const startServer = async ()=>{
    try {
        app.listen(process.env.SERVERPORT,()=>{
            console.log(`The server is now running on port: ${process.env.SERVERPORT}`)
        })
    } catch (error) {  
        console.log(error)
    }
}
startServer()