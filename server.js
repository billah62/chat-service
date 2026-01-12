
const express = require("express");
const app = express();
const cors = require("cors");
const path = require("path");
const http = require("http");
const { Server } = require("socket.io");
const { mongodb }= require("./db")
const mongoose = require("mongoose");

mongodb();

const MessageSchema = mongoose.Schema(

     {
          socket: { type : String , required:true},
          message:{ type: String , required:true}
     },
     {
          timestamps:true
     });

const Message = mongoose.model('Messages', MessageSchema);

app.use(express.json());
app.use(express.static( path.join( __dirname,'public')));

app.get("/",(req,res)=>{

     res.sendFile(path.join(__dirname,'public','Index.html'));
})

app.get("/api/getremotedata",(req,res)=>{
     
     res.send([
          {id:10 , empName: 'jayan'},
          {id : 20 , empName: 'Agaq'}

     ]);
});

app.post("/api/messagePost",async(req,res)=>{

     try
     {
     const {socket , message} = req.body;
     console.log(socket);
     console.log(message)
     const Msg = new Message({ socket , message});
     await Msg.save();
     res.send(Msg);

     } catch(err)
     {
          console.log()
          res.status(500).send('Message is not saved')
     }
});







const httpServer = http.createServer(app);

const io = new Server(httpServer,{
     'cors':{ 'origin': '*'}
});

io.on("connection",(socket)=>{

     console.log("new user is connected with having id "+ socket.id);

     socket.on("Chat Data",async(data)=>{

          console.log(data)
               await fetch('http://localhost:5000/api/messagePost',

                {
                      method : "POST",
                      headers :{ "Content-Type": "application/json"},
                      body: JSON.stringify({ socket: socket.id , message: data })
                }

               ).then(d => d.json()).then(da =>{
                    console.log(da)
                     io.emit("Send Data",data);

               }).catch(err =>{

                    console.log(err)
               })
                
               
          })


          

     });

httpServer.listen(5000,()=>{

     console.log("your server is running at 5000")

});