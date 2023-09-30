import { Router } from "express";
import { userModel } from "../models/users.models.js";
import passport from 'passport';

const sessionRouter = Router()

sessionRouter.post('/login', passport.authenticate('local', { failureRedirect: '/login' }), (req, res) => {
  res.redirect('/rutaProductos');
});

sessionRouter.get('/logout', (req, res) => {
  req.logout();
  res.redirect('rutaLogin');
});

export default sessionRouter
