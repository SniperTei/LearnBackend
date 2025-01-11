const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose');
const MovieDAL = require('../../../src/dal/movie.dal');
const Movie = require('../../../src/models/movie.model');
const User = require('../../../src/models/user.model');

let mongoServer;

const mockUser = {
  username: 'testuser',
  email: 'test@example.com',
  password: 'password123',
  birthDate: new Date('1990-01-01'),
  gender: 'male'
};

const mockMovie = {
  title: '测试电影',
  actors: ['演员1', '演员2'],
  genres: ['动作', '冒险'],
  director: '导演1',
  imageUrl: 'http://example.com/image.jpg',
  movieUni: 'MOVIE001',
  country: '中国',
  publishDate: new Date('2024-01-01'),
  rating: 8.5,
  eflag: 'N',
  devFlag: 'N',
  desc: '电影描述',
  synopsis: '剧情简介'
};

describe('Movie DAL Tests', () => {
  let user;

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    await mongoose.connect(mongoUri);
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  beforeEach(async () => {
    await mongoose.connection.dropDatabase();
    user = await User.create(mockUser);
  });

  describe('create', () => {
    it('should create a new movie', async () => {
      const movieData = {
        ...mockMovie,
        createdBy: user._id,
        updatedBy: user._id
      };

      const movie = await MovieDAL.create(movieData);

      expect(movie.title).toBe(mockMovie.title);
      expect(movie.actors).toEqual(mockMovie.actors);
      expect(movie.genres).toEqual(mockMovie.genres);
      expect(movie.director).toBe(mockMovie.director);
      expect(movie.movieUni).toBe(mockMovie.movieUni);
      expect(movie.createdBy.toString()).toBe(user._id.toString());
    });
  });

  describe('findAll', () => {
    beforeEach(async () => {
      const movies = [
        { ...mockMovie, title: '电影1', movieUni: 'MOVIE001', createdBy: user._id, updatedBy: user._id },
        { ...mockMovie, title: '电影2', movieUni: 'MOVIE002', createdBy: user._id, updatedBy: user._id },
        { ...mockMovie, title: '电影3', movieUni: 'MOVIE003', createdBy: user._id, updatedBy: user._id }
      ];
      await Movie.insertMany(movies);
    });

    it('should return movies with pagination', async () => {
      const { movies, total } = await MovieDAL.findAll({}, { skip: 0, limit: 2 });

      expect(movies).toHaveLength(2);
      expect(total).toBe(3);
    });

    it('should filter movies by query', async () => {
      const { movies, total } = await MovieDAL.findAll({ title: '电影1' }, {});

      expect(movies).toHaveLength(1);
      expect(movies[0].title).toBe('电影1');
      expect(total).toBe(1);
    });
  });

  describe('findById', () => {
    let savedMovie;

    beforeEach(async () => {
      savedMovie = await Movie.create({
        ...mockMovie,
        createdBy: user._id,
        updatedBy: user._id
      });
    });

    it('should find movie by id', async () => {
      const movie = await MovieDAL.findById(savedMovie._id);

      expect(movie.title).toBe(mockMovie.title);
      expect(movie._id.toString()).toBe(savedMovie._id.toString());
    });
  });

  describe('update', () => {
    let savedMovie;

    beforeEach(async () => {
      savedMovie = await Movie.create({
        ...mockMovie,
        createdBy: user._id,
        updatedBy: user._id
      });
    });

    it('should update movie', async () => {
      const updatedMovie = await MovieDAL.update(savedMovie._id, {
        title: '更新后的电影',
        updatedBy: user._id
      });

      expect(updatedMovie.title).toBe('更新后的电影');
      expect(updatedMovie._id.toString()).toBe(savedMovie._id.toString());
    });
  });

  describe('delete', () => {
    let savedMovie;

    beforeEach(async () => {
      savedMovie = await Movie.create({
        ...mockMovie,
        createdBy: user._id,
        updatedBy: user._id
      });
    });

    it('should delete movie', async () => {
      await MovieDAL.delete(savedMovie._id);
      const movie = await Movie.findById(savedMovie._id);
      expect(movie).toBeNull();
    });
  });

  describe('search', () => {
    beforeEach(async () => {
      const movies = [
        { ...mockMovie, title: '动作电影1', genres: ['动作'], createdBy: user._id, updatedBy: user._id },
        { ...mockMovie, title: '喜剧电影1', genres: ['喜剧'], createdBy: user._id, updatedBy: user._id },
        { ...mockMovie, title: '动作电影2', genres: ['动作'], createdBy: user._id, updatedBy: user._id }
      ];
      await Movie.insertMany(movies);
    });

    it('should search movies by keyword', async () => {
      const { movies, total } = await MovieDAL.search('动作', {});

      expect(movies).toHaveLength(2);
      expect(total).toBe(2);
      expect(movies.every(m => m.title.includes('动作'))).toBe(true);
    });
  });
});
