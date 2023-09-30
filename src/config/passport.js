import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { Strategy as GithubStrategy } from 'passport-github';
import { userModel } from './models/user.model.js';


const initializePassport = () => {
passport.use('local', new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password'
}, async (email, password, done) => {
  try {
    const user = await userModel.findOne({ email });
    if (!user) {
      return done(null, false);
    }
    const isMatch = await user.isValidPassword(password);
    if (!isMatch) {
      return done(null, false);
    }
    return done(null, user);
  } catch (error) {
    done(error);
  }
}));

passport.use(new GithubStrategy({
  clientID: GITHUB_CLIENT_ID,
  clientSecret: GITHUB_CLIENT_SECRET,
  callbackURL: "http://127.0.0.1:3000/auth/github/callback"
},
function(accessToken, refreshToken, profile, cb) {
  User.findOrCreate({ githubId: profile.id }, function (err, user) {
    return cb(err, user);
  });
}));
}
export default initializePassport