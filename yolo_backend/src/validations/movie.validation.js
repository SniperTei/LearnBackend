const Joi = require('joi');
const { objectId } = require('./custom.validation');

const movieValidation = {
  create: {
    body: Joi.object().keys({
      title: Joi.string().required(),
      actors: Joi.array().items(Joi.string()),
      genres: Joi.array().items(Joi.string()),
      director: Joi.string(),
      imageUrl: Joi.string().uri(),
      movieUni: Joi.string(),
      country: Joi.string(),
      publishDate: Joi.date(),
      rating: Joi.number().min(0).max(10),
      eflag: Joi.string().valid('Y', 'N'),
      devFlag: Joi.string().valid('Y', 'N'),
      desc: Joi.string(),
      synopsis: Joi.string()
    })
  },

  update: {
    params: Joi.object().keys({
      id: Joi.string().custom(objectId).required()
    }),
    body: Joi.object().keys({
      title: Joi.string(),
      actors: Joi.array().items(Joi.string()),
      genres: Joi.array().items(Joi.string()),
      director: Joi.string(),
      imageUrl: Joi.string().uri(),
      movieUni: Joi.string(),
      country: Joi.string(),
      publishDate: Joi.date(),
      rating: Joi.number().min(0).max(10),
      eflag: Joi.string().valid('Y', 'N'),
      devFlag: Joi.string().valid('Y', 'N'),
      desc: Joi.string(),
      synopsis: Joi.string()
    }).min(1)
  },

  delete: {
    params: Joi.object().keys({
      id: Joi.string().custom(objectId).required()
    })
  },

  get: {
    params: Joi.object().keys({
      id: Joi.string().custom(objectId).required()
    })
  },

  list: {
    query: Joi.object().keys({
      page: Joi.number().integer().min(1),
      limit: Joi.number().integer().min(1).max(100),
      title: Joi.string(),
      director: Joi.string(),
      country: Joi.string(),
      genres: Joi.string(),
      actors: Joi.string(),
      eflag: Joi.string().valid('Y', 'N'),
      devFlag: Joi.string().valid('Y', 'N')
    })
  },

  search: {
    query: Joi.object().keys({
      page: Joi.number().integer().min(1),
      limit: Joi.number().integer().min(1).max(100),
      keyword: Joi.string(),
      genres: Joi.string(),
      actors: Joi.string(),
      director: Joi.string()
    })
  }
};

module.exports = {
  movieValidation
};
