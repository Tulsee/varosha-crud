const Joi = require('joi');

const authSchema = Joi.object({
  email: Joi.string().email().lowercase().required(),
  password: Joi.string().required(),
});

const registerSchema = Joi.object({
  name: Joi.string().min(5).max(30).required(),
  email: Joi.string().email().lowercase().required(),
  password: Joi.string().required(),
});

module.exports = {
  authSchema,
  registerSchema,
};
