// const express =require("express");//here in const express express is variablle we can name it anything else to save Express 
// const app = express();// when we ran express using the given command express's all power got into app named variable
// //simply app also have same capabilities as express
// app.get("/",(req,res)=>{  //using the app function we create a get route ie. '/'
//     res.send("Express is working!");
// });

// app.listen(3000, ()=>{
//     console.log("server running on port 3000");
// });

const express =require("exxpress");
const app = express();

app.use(function(req,res,next){
    next();
});

app.get("/",function(req,res,next){
    res.send("hello world");
});

app.get("/profile",function(req,res){
    res.send("hello from profile");

});