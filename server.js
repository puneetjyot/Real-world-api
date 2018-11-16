const express= require('express')
const passport = require('passport')
const session = require('express-session')
const flash=require('connect-flash')
const secret=require('./key')
const {
    db
  } = require('./db/index.js')
  

const app= express()
app.use(session({
  secret:secret.sessionsecret
}))
app.use(express.json())
app.use(express.urlencoded({
  extended: true
}))
app.use(passport.initialize())
app.use(passport.session())
app.use(flash(

))

app.use('/api', require('./routes/user'))
app.use('/api/profiles', require('./routes/profile'))

app.listen(8090,()=>{
  console.log("server started")
})
