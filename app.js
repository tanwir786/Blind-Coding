const express=require("express");
const mongoose=require("mongoose");
const User=require("./userModel");
const app=express();

const api="/api/v1";
mongoose.connect('mongodb://localhost:27017/blindCoding',
  { useNewUrlParser: true, useUnifiedTopology: true})
  .then(() => {
    console.log('We are Connected to Database');
})
.catch(err => {
    console.log("Database Error!!");
    console.log(err);
});
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get(`${api}`, (req, res)=>{
    res.send("HI, Blind conding");
})

app.post(`${api}/register`, async (req, res)=>{
    try{
        const data=req.body;
        const email=req.body.email;
        let user= await User.findOne({email});
        if (!user){
            user=new User(data);
            user.time= Date.now();
            await user.save();
            res.json(user);
        }else{
            const current= Date.now();
            let difference=60*60-current/1000+user.time/1000;
            res.json(difference);
        }
        
    }catch(e){
        res.send(e);
    }
})
app.post(`${api}/submit`, async(req, res)=>{
    try{
        const {email, code}=req.body;
        let user= await User.findOne({email});
        console.log(user);
        if (!user){
            res.send({success: false});
        }
        else {
            user.code=code;
            await user.save();
            res.send({success: true});
        }
    }catch(e){
        res.send(e);
    }
})
app.listen(3000, ()=>{
    console.log("Server Started");
})