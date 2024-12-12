// backend/routes/api/session.js
// ...
const express = require('express');
const router = express.Router();
const { validateLogin } = require('../../utils/validation');
const { handleValidationErrors } = require('../../utils/validation');

// Your login route
router.post('/', validateLogin, handleValidationErrors, async (req, res) => {
  // Login logic here
});



const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
// ...
// backend/routes/api/session.js
// ...

const validateLogin = [
    check('credential')
      .exists({ checkFalsy: true })
      .notEmpty()
      .withMessage('Please provide a valid email or username.'),
    check('password')
      .exists({ checkFalsy: true })
      .withMessage('Please provide a password.'),
    handleValidationErrors
  ];

  // Log in
router.post(
    '/',
    validateLogin,
    async (req, res, next) => {
      const { credential, password } = req.body;
  
      const user = await User.unscoped().findOne({
        where: {
          [Op.or]: {
            username: credential,
            email: credential
          }
        }
      });
  
      if (!user || !bcrypt.compareSync(password, user.hashedPassword.toString())) {
        const err = new Error('Login failed');
        err.status = 401;
        err.title = 'Login failed';
        err.errors = { credential: 'The provided credentials were invalid.' };
        return next(err);
      }
  
      const safeUser = {
        id: user.id,
        email: user.email,
        username: user.username,
      };
  
      await setTokenCookie(res, safeUser);
  
      return res.json({
        user: safeUser
      });
    }
  );
  
  module.exports = router;