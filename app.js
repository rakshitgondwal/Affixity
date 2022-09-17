import express from 'express';
import mongoose from 'mongoose';

const port = 3000;


const app = express();

mongoose.connect('mongodb+srv://rakshitgondwal:chitkararakshit@cluster0.wofkim8.mongodb.net/affixity');


app.use(express.urlencoded({
    extended: true
}));


app.get("/posts", function(req,res){
    res.send("Nice");
});


app.get("/signin", function(req,res){
    res.sendFile(__dirname+"/views/signin.html");
} );


app.get("/", function(req,res){
    res.send("Server working properly.!")
});

app.listen(port, () => {
    console.log(`Server started on port ${port}`);
  });