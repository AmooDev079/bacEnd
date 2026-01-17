let http = require("http");
let express = require("express");
let WebSocket = require("socket.io");
const cors = require('cors');
let mysql = require('mysql');
let app = express();

//creating database
// let con = mysql.createConnection({
//     database:'chatapp',
//     password:'password',
//     host:'localhost',
//     user:'root'
// })
//coonecting to databas
// con.connect(function(err){
//     if(err){
//         console.log('errr',err)
//     }else{
//         console.log("database connected")
//     }
// })

const corsOptions = {
origin: 'https://localhost/3002', // Allow only this origin
};

app.use(express.static('frontend'))
app.use(cors())
app.use(express.json())

//server creation
let server = http.createServer(app);

//connecting server to socket
let io = new WebSocket.Server(server,{
  cors: {
    origin: ["http://192.168.230.173:5173"]
  }})

let currUser;
//get Req
app.get("/",(req,res)=>{
res.send("Welcome from Back")
})


//connecting to socket
io.on('connection',function(socket){
    console.log("connected",socket.id)
   //signin part
    socket.on('signin',(data)=>{
        console.log(data)
        if(data.uName !==''){
            // con.query('insert into userinfo (name,password) values("'+data.uName+'", "'+
            //     data.pass+'");',(err,result)=>{
            //         if(err){
            //             console.log('From sql',err)
            //         }else{console.log('signed in')}
            //     })
            socket.emit('signedIn',data)
        }else{
            return
        }
    })

//login post
app.post('/loginin',(req,res)=>{

    if(req.body!==null){
        res.json({name:req.body.u})
    }
    else{
        res.status(401)
    }
    

})

    socket.on("msgSent",(data)=>{
        console.log(data)
        let sql = 'insert into msgs (msgfrom,msgto,msg) values("'+
        data.from+'", "'+data.to+'", "'+data.text+'");';
        // con.query(sql,(err,result)=>{
        //     if(!err){
        //         console.log("Saved")

        //     }else{
        //         console.log('err saving',err)
        //     }
        // })
        data.st = true
        data.id=Date.now();
        socket.broadcast.emit("msgReceived",data)
    })

    //receinving img

    socket.on('sendingImg',(data)=>{
        console.log('img received',data)
        data.tr =false
        socket.broadcast.emit('imgHere',data)
    })

    ///fetch chatters
    socket.on("hello",(d)=>{
        // con.query('select name from userinfo;',(err,results)=>{
        //     if(!err){console.log('ddddddd',results)}else{console.log(err)}
        //     let c =[]
        //     results.forEach(element => {
        //        c.push(element.name) 
        //     })
        //     console.log(c)
        // })
         socket.emit('chhaters',c)
    })

    

   
   
   // console.log(currUser)

    socket.on("disconnect",function(){
        console.log("disconnected")
    })
})

//socket on error
io.on("error",()=>{
    console.log('error on server')
})

//server listening
server.listen("3002","0.0.0.0",(err)=>{
    if(err){
        console.log("Error" ,err);
    }else{
        console.log("live at http://192.168.230.173:3002")
    }
})
