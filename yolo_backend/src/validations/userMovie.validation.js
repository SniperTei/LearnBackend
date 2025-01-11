const Joi = require('joi');
const { objectId } = require('./custom.validation');

const userMovieValidation = {
  get: {
    params: Joi.object().keys({
      movieId: Joi.string().custom(objectId).required()
    })
  },

  list: {
    query: Joi.object().keys({
      page: Joi.number().integer().min(1),
      limit: Joi.number().integer().min(1).max(100),
      status: Joi.string().valid('watched', 'want_to_watch', 'liked')
    })
  },

  watch: {
    params: Joi.object().keys({
      movieId: Joi.string().custom(objectId).required()
    }),
    body: Joi.object().keys({
      rating: Joi.number().min(0).max(5),
      review: Joi.string().max(1000)
    })
  },

  wantToWatch: {
    params: Joi.object().keys({
      movieId: Joi.string().custom(objectId).required()
    })
  },

  toggleLike: {
    params: Joi.object().keys({
      movieId: Joi.string().custom(objectId).required()
    })
  },

  rating: {
    params: Joi.object().keys({
      movieId: Joi.string().custom(objectId).required()
    }),
    body: Joi.object().keys({
      rating: Joi.number().min(0).max(5).required()
    })
  },

  review: {
    params: Joi.object().keys({
      movieId: Joi.string().custom(objectId).required()
    }),
    body: Joi.object().keys({
      review: Joi.string().max(1000).required()
    })
  }
};

module.exports = {
  userMovieValidation
};
