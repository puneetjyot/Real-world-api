const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const { User } = require('../db/index');

passport.serializeUser(function (user, done) {

  done(null, user.user_id)
});

passport.deserializeUser(function (userKey, done) {

  User.findByPrimary(userKey).then((user) => {
    done(null, user)
  }).catch((err) => {

    done(err)
  })
});



passport.use(new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password'
},
  function (username, password, done) {
    User.findOne({
      where: {

        email: username,
        password:password
      }
    }).then((user) => {
      console.log(user)
      if (!user) {
        return done(null, false, { message: 'Incorrect username or password.' });
      }

      return done(null, user);
    }).catch((err) => {
      done(err)
    })
  }
));

module.exports = passport
