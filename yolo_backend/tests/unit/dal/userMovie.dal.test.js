const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose');
const UserMovieDAL = require('../../../src/dal/userMovie.dal');
const UserMovie = require('../../../src/models/userMovie.model');
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

describe('UserMovie DAL Tests', () => {
  let user;
  let movie;

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
    movie = await Movie.create({
      ...mockMovie,
      createdBy: user._id,
      updatedBy: user._id
    });
  });

  describe('create', () => {
    it('should create a new user movie record', async () => {
      const userMovieData = {
        userId: user._id,
        movieId: movie._id,
        watchStatus: 'watched',
        wantToWatchStatus: 'N',
        likeStatus: 'Y',
        rating: 4,
        review: '很好看的电影',
        createdBy: user._id,
        updatedBy: user._id
      };

      const userMovie = await UserMovieDAL.create(userMovieData);

      expect(userMovie.userId.toString()).toBe(user._id.toString());
      expect(userMovie.movieId.toString()).toBe(movie._id.toString());
      expect(userMovie.watchStatus).toBe('watched');
      expect(userMovie.rating).toBe(4);
    });
  });

  describe('findOne', () => {
    let savedUserMovie;

    beforeEach(async () => {
      savedUserMovie = await UserMovie.create({
        userId: user._id,
        movieId: movie._id,
        watchStatus: 'watched',
        wantToWatchStatus: 'N',
        likeStatus: 'Y',
        rating: 4,
        review: '很好看的电影',
        createdBy: user._id,
        updatedBy: user._id
      });
    });

    it('should find user movie record', async () => {
      const userMovie = await UserMovieDAL.findOne(user._id, movie._id);

      expect(userMovie.userId.toString()).toBe(user._id.toString());
      expect(userMovie.movieId._id.toString()).toBe(movie._id.toString());
      expect(userMovie.watchStatus).toBe('watched');
    });
  });

  describe('update', () => {
    let savedUserMovie;

    beforeEach(async () => {
      savedUserMovie = await UserMovie.create({
        userId: user._id,
        movieId: movie._id,
        watchStatus: 'not_watched',
        wantToWatchStatus: 'N',
        likeStatus: 'N',
        createdBy: user._id,
        updatedBy: user._id
      });
    });

    it('should update user movie record', async () => {
      const updatedUserMovie = await UserMovieDAL.update(user._id, movie._id, {
        watchStatus: 'watched',
        rating: 5,
        review: '非常棒的电影',
        updatedBy: user._id
      });

      expect(updatedUserMovie.watchStatus).toBe('watched');
      expect(updatedUserMovie.rating).toBe(5);
      expect(updatedUserMovie.review).toBe('非常棒的电影');
    });
  });

  describe('findUserMovies', () => {
    beforeEach(async () => {
      const movies = [
        { ...mockMovie, title: '电影1', movieUni: 'MOVIE001' },
        { ...mockMovie, title: '电影2', movieUni: 'MOVIE002' },
        { ...mockMovie, title: '电影3', movieUni: 'MOVIE003' }
      ];

      const createdMovies = await Movie.insertMany(
        movies.map(m => ({ ...m, createdBy: user._id, updatedBy: user._id }))
      );

      const userMovies = createdMovies.map((m, index) => ({
        userId: user._id,
        movieId: m._id,
        watchStatus: index % 2 === 0 ? 'watched' : 'not_watched',
        wantToWatchStatus: index % 2 === 0 ? 'N' : 'Y',
        likeStatus: index % 2 === 0 ? 'Y' : 'N',
        createdBy: user._id,
        updatedBy: user._id
      }));

      await UserMovie.insertMany(userMovies);
    });

    it('should find user movies with pagination', async () => {
      const { userMovies, total } = await UserMovieDAL.findUserMovies(
        user._id,
        { watchStatus: 'watched' },
        { skip: 0, limit: 10 }
      );

      expect(userMovies).toHaveLength(2);
      expect(total).toBe(2);
      expect(userMovies.every(um => um.watchStatus === 'watched')).toBe(true);
    });
  });

  describe('findMovieStats', () => {
    beforeEach(async () => {
      const userMovies = [
        {
          userId: user._id,
          movieId: movie._id,
          watchStatus: 'watched',
          wantToWatchStatus: 'N',
          likeStatus: 'Y',
          rating: 4,
          review: '很好看',
          createdBy: user._id,
          updatedBy: user._id
        },
        {
          userId: user._id,
          movieId: movie._id,
          watchStatus: 'watched',
          wantToWatchStatus: 'N',
          likeStatus: 'Y',
          rating: 5,
          review: '非常棒',
          createdBy: user._id,
          updatedBy: user._id
        }
      ];

      await UserMovie.insertMany(userMovies);
    });

    it('should return movie statistics', async () => {
      const stats = await UserMovieDAL.findMovieStats(movie._id);

      expect(stats.watchCount).toBe(2);
      expect(stats.likeCount).toBe(2);
      expect(stats.averageRating).toBe(4.5);
      expect(stats.reviewCount).toBe(2);
    });
  });
});
