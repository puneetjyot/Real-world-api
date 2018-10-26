const express= require('express')


const app= express()

app.use(express.json())
app.use(express.urlencoded({
  extended: true
}))

app.get('/',function(req,res){
    res.send("hello world")
})

app.listen(3939,()=>{
    console.log("sever started at 3939")
})