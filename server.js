const express= require('express');
const app= express();
const bodyparser= require('body-parser');
const jwt=require('jsonwebtoken');
const user=require('./user.json')
const cars=require('./car.json')

app.use(bodyparser.json());

app.use(bodyparser.urlencoded({extended:false}));


app.post('/login',(req,res)=>{
    const users =  user.find((usr)=> usr.username===req.body.username);

    if(users){
        if(users.password === req.body.password){
            const token = jwt.sign({userID: user.user_id}, 'MODULE');
            res.status(200).send({token})
        }else{
            res.status(401).send({message: err.message})
        }
    }
    else{
        res.status(401).send({message: err.message})
    }
})
function checkToken(req,res,next){
    const token = req.headers['authorization'];
    if(token){
        jwt.verify(token,'MODULE',(err,decode)=>{
            if(err){
                res.status(401).send({message:"Access Denied"})
                return;
            }
            else{
                req.userID=decode.userID;
                next();
            }
        })
    }
}
app.get('/data',checkToken,(req,res)=>{
  const filtered = cars.filter((car)=>car.userID===req.userID );
  res.status(200).send({data: filtered})
})

app.listen(5000,()=>{
    console.log("connected")
})

