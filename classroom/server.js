 const express =require("express")
 const app= express()
 const users=  require("./routes/user.js")
 const posts=  require("./routes/post.js")
 const session  =  require("express-session")

app.use(session({secret:"mysupersecrete"}) )

app.get("/test",(req,res)=>{
   res.send("test succesfully")
})

app.get("/count",(req,res)=>{
   req.session.count 
})

 app.listen(3000,()=>{
    console.log("listening to the port 3000")
 })







// app.get("/getcookies", (req,res)=>{
//    res.cookie("greet", "hello")
//    res.send("send some cookies")
//  })


//  app.get("/", (req,res)=>{
//     res.send("hi i'am root ")
//  })


// app.use("/users",users)
// app.use("/posts",posts)



// //  show route
//  app.get("/posts",(req,res)=>{
//     res.send("get for show posts")
//  })


//  app.post("/posts/:id",(req,res)=>{
//     res.send("post to user")
//  })
 