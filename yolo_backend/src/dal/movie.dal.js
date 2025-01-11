const Movie = require('../models/movie.model');

class MovieDAL {
  static async create(movieData) {
    return await Movie.create(movieData);
  }

  static async findAll(query, options) {
    const { skip = 0, limit = 10, sort = { createdAt: -1 } } = options;
    
    const movies = await Movie.find(query)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .populate('createdBy', 'username')
      .populate('updatedBy', 'username');

    const total = await Movie.countDocuments(query);

    return { movies, total };
  }

  static async findById(id) {
    return await Movie.findById(id)
      .populate('createdBy', 'username')
      .populate('updatedBy', 'username');
  }

  static async findByMovieUni(movieUni) {
    return await Movie.findOne({ movieUni })
      .populate('createdBy', 'username')
      .populate('updatedBy', 'username');
  }

  static async update(id, updateData) {
    return await Movie.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    ).populate('createdBy', 'username')
      .populate('updatedBy', 'username');
  }

  static async delete(id) {
    return await Movie.findByIdAndDelete(id);
  }

  static async findByGenres(genres, options) {
    const { skip = 0, limit = 10 } = options;
    const query = { genres: { $in: genres } };
    
    const movies = await Movie.find(query)
      .sort({ rating: -1, createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('createdBy', 'username')
      .populate('updatedBy', 'username');

    const total = await Movie.countDocuments(query);

    return { movies, total };
  }

  static async findByActors(actors, options) {
    const { skip = 0, limit = 10 } = options;
    const query = { actors: { $in: actors } };
    
    const movies = await Movie.find(query)
      .sort({ rating: -1, createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('createdBy', 'username')
      .populate('updatedBy', 'username');

    const total = await Movie.countDocuments(query);

    return { movies, total };
  }

  static async findByDirector(director, options) {
    const { skip = 0, limit = 10 } = options;
    const query = { director };
    
    const movies = await Movie.find(query)
      .sort({ rating: -1, createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('createdBy', 'username')
      .populate('updatedBy', 'username');

    const total = await Movie.countDocuments(query);

    return { movies, total };
  }

  static async search(keyword, options) {
    const { skip = 0, limit = 10 } = options;
    const query = {
      $or: [
        { title: { $regex: keyword, $options: 'i' } },
        { director: { $regex: keyword, $options: 'i' } },
        { actors: { $regex: keyword, $options: 'i' } },
        { synopsis: { $regex: keyword, $options: 'i' } }
      ]
    };
    
    const movies = await Movie.find(query)
      .sort({ rating: -1, createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('createdBy', 'username')
      .populate('updatedBy', 'username');

    const total = await Movie.countDocuments(query);

    return { movies, total };
  }
}

module.exports = MovieDAL;
