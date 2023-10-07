import passport from 'passport';
import local from 'passport-local'
import { userModel } from '../models/user.model.js';
import { createHash, validatePassword } from '../utils/bcrypt.js';

const LocalStrategy = local.Strategy;

const initializePassport = () => {
passport.use(
  "register",
  new LocalStrategy(
    {
      passReqToCallback: true,
      usernameField: "email"
    },
    async (req, username, passowrd, done) => {
      const {nombre, apellido, email} = req.body
      try{
        const user = await userModel.findOne({email: email});
        
        if (user){
          return done(null,false);
        }
        const passwordHash = createHash(password);
        const userCreated = await userModel.create({
          nombre:nombre,
          apellido:apellido,
          email:email,
          password: passwordHash,
        });
        return done(null, userCreated);
      } catch(error){
        return done(error)
      }
    }
  )
)

passport.use(
  "login",
  new LocalStrategy({
    usernameField:"email"},
    async (username, password, done) => {
      try {
        const user = await userModel.findOne({email:username});

        if(!user){
          return done(null, false);
        }
        if(validatePassword(password, user.password)){
          return done(null,user);
        }
        return done(null, false);
      } catch(error){
        return done(error);
      }
    }
    )
);
passport.serializeUser((user, done) => {
  done(null,user._id)
})
passport.deserializeUser(async(id, done)=> {
  const user = await userModel.findById(id)
  done(null,user)
})
}
export default initializePassport