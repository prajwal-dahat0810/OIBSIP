const express = require('express')
const bcrypt = require('bcrypt');
let password;
const app = express()
const port = 3002
const USERS=[];

var bodyParser = require('body-parser')
app.use(bodyParser.urlencoded())
app.use(bodyParser.json())

app.get('/getUsers', (req, res) => {
  console.log(USERS); // Logging the USERS array to the console

  // Sending the USERS array as part of the response
  res.send(USERS);
});
app.get('/', (req, res) => {
 
  res.sendFile(__dirname + '/start.html');
});
app.get('/signup',(req,res)=>{
  res.sendFile(__dirname +'/signup.html');
  //  res.send('<html><h1 >sign up </h1><form action="/signup" method="post"><input type="email" name="Email" placeholder="Enter Email"><input type="password" name="Password" placeholder="Enter Password"><input type="submit"></form></html>')
})
app.post('/signup', (req, res) =>{
  let email = req.body.Email;
 password = req.body.Password; 


//check if user exists or not
let userExists = USERS.some(user => user.email === email);

if (userExists) {
  // Return 409 Conflict status code if user already exists
  res.status(409).send(' Already User sign UP');
} else {
///hashing the password to store
 bcrypt.hash(password, 10, (err, hashedPassword) => {
      if (err) {
        console.error(err);
        return;
      }
      password=hashedPassword;
       // Create a new user object with the email and password
       const newUser = {
       email,
       password:hashedPassword
       };
        USERS.push(newUser);
        res.send(USERS)
    // Return 200 OK status code and success message
    //res.status(200).send('User created successfully');
  }

  );

}});









app.post('/login',function(req,res){
  let email = req.body.Email;
  let Password = req.body.Password; 

 




  let userExists = USERS.some(user => user.email === email );
  if(!userExists){
    console.log("User Not Exist OR Enter the Right User")
  }
  let user = USERS.find(user => user.email === email);

  bcrypt.compare(Password, user.password, (err, result) => {
    if (err) {
      console.error(err);
      return;
    }




/* 
  let passwordExist=USERS.some(user=>user.password===Password);
  bcrypt.compare(Password, password, (err, result) => {
    if (err) {
      console.error(err);
     
      return;
    }
 */
    if (result) {
   ///   console.log('Password is correct.');
      if(userExists&&password){ 
        res.status(200).send('User login  successfully');
      }
    } else {
      
      res.status(401).send('enter right Password');
      ///console.log('Password is incorrect.');
    }

   
  });
});

/* app.get('/signup',(req,res)=>{
  res.sendFile(__dirname +"/signup.html");
  //  res.send('<html><h1 >sign up </h1><form action="/signup" method="post"><input type="email" name="Email" placeholder="Enter Email"><input type="password" name="Password" placeholder="Enter Password"><input type="submit"></form></html>')
}) */

app.get('/login', (req, res)=> {
 res.sendFile(__dirname +'/login.html')
  //res.send('<html><h1 >LOGIN</h1><form action="/login" method="post"><input type="email" name="Email" placeholder="Enter Email"><input type="password" name="Password" placeholder="Enter Password"><input type="submit"></form></html>')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
