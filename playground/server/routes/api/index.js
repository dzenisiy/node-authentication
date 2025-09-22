const { Router } = require('express');

const router = Router();
const jwt = require('jsonwebtoken');
const passport = require('passport');
const todolistRouter = require('./todolist');

module.exports = (params) => {
  const { config } = params;

  router.post(
    '/login',
    passport.authenticate('local', {
      session: false,
    }),
    async (req, res, next) => {
      try {
        const token = jwt.sign(
          {
            userId: req.user.id,
          },
          config.JWTSECRET,
          { expiresIn: '24h' }
        );
        return res.json({ jwt: token });
      } catch (err) {
        return next(err);
      }
    }
  );

  router.get(
    '/whoami',
    passport.authenticate('jwt', {
      sesssion: false,
    }),
    (req, res) => {
      return res.json({
        username: req.user.username,
      });
    }
  );

  router.use(
    '/todolist',
    passport.authenticate('jwt', {
      sesssion: false,
    }),
    todolistRouter(params)
  );

  return router;
};
