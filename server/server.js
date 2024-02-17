import express from 'express';
const app = express();
const port = 3000;
import cors from 'cors';
import fs from 'fs'
import crypto from 'crypto'
app.use(cors()) // Use this after the variable declaration
import nodemailer from 'nodemailer'
function signDocument(privateKeyPath, documentPath) {
    // Read the private key
    const privateKey = fs.readFileSync(privateKeyPath, 'utf8');

    // Read the document content
    const documentContent = fs.readFileSync(documentPath, 'utf8');

    // Create a signature 
    const sign = crypto.createSign('SHA256');
    sign.update(documentContent);
    const signature = sign.sign(privateKey, 'base64');

    return signature;
}
app.get('/hello',(req,res)=>{
    return res.json("Hello")
})
// Define a route that responds with a JSON object
app.get('/generate_digital_signature', (req, res) => {

    const privateKeyPath = 'private_key.pem';
    console.log(req.query.param1)
const documentPath = String(req.query.param1);

const digitalSignature = signDocument(privateKeyPath, documentPath);
console.log(digitalSignature)
  res.json({ digitalSignature: digitalSignature });
});

function verifySignature(publicKeyPath, documentPath, signature) {
    // Read the public key
    const publicKey = fs.readFileSync(publicKeyPath, 'utf8');

    // Read the document content
    const documentContent = fs.readFileSync(documentPath, 'utf8');

    // Create a verifier
    const verify = crypto.createVerify('SHA256');
    verify.update(documentContent);

    // Verify the signature
    const isSignatureValid = verify.verify(publicKey, signature, 'base64');

    return isSignatureValid;
}
app.get("/email", (req, res) => {
    
  const email=req.query.param1
  const filename=req.query.param2
 
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
      user: 'nkumawat34@gmail.com',
      pass: 'gycqvhkemgzcirqu'
  }
});


function sendEmail(email) {
  
  const mailOptions = {
      from: 'nkumawat34@gmail.com',
      to: email, 
      subject: "Your Document " +filename+"has uploaded",
      text: "Your Document has been uploaded on the system "
  };

  
  transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
          console.error('Error sending email:', error);
      } else {
          console.log('Email sent:', info.response);
      }
  });
}



sendEmail(email);

 
});


app.get('/verify_digital_signature', (req, res) => {
    const publicKeyPath = 'public_key.pem';
const documentPath = String(req.query.param1);
const digitalSignature = String(req.query.param2); // Provide the digital signature to be verified

const isSignatureValid = verifySignature(publicKeyPath, documentPath, digitalSignature);
    res.json({ isSignatureValid: isSignatureValid });
  });
// Start the server
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
