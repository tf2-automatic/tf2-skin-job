import * as Joi from 'joi';

const validation = Joi.object({
  NODE_ENV: Joi.string().valid('development', 'production', 'test').required(),
  TF2_SKIN_SERVICE_URL: Joi.string().required(),
});

export { validation };
