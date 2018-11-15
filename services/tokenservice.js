const jwt = require('jsonwebtoken')
const key = require('../key');

function generateToken(username) {
    return jwt.sign({ payload: username }, key.secret)
}
function decryptToken(token) {
   
    let email;
   
    try {
        email = jwt.verify(token, key.secret).payload;
       
    }
    catch (err) {
        return {
            email: null,
            error: err.message
          }
      
    }
    return {
        email,
        error: null
      }
    
}

module.exports = {
    generateToken,decryptToken
}
