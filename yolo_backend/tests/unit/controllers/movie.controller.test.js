const MovieController = require('../../../src/controllers/movie.controller');
const MovieService = require('../../../src/services/movie.service');
const ApiResponse = require('../../../src/utils/response');

// Mock MovieService
jest.mock('../../../src/services/movie.service');

describe('MovieController', () => {
  let mockReq;
  let mockRes;
  let mockNext;

  beforeEach(() => {
    mockReq = {
      body: {},
      params: {},
      query: {},
      user: { _id: 'testUserId' }
    };
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    mockNext = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('listMovies', () => {
    it('should list movies with default pagination', async () => {
      const mockResult = {
        movies: [{ title: 'Test Movie' }],
        total: 1,
        totalPages: 1,
        currentPage: 1
      };
      MovieService.listMovies.mockResolvedValue(mockResult);

      await MovieController.listMovies(mockReq, mockRes, mockNext);

      expect(MovieService.listMovies).toHaveBeenCalledWith(
        {},
        { skip: 0, limit: 10 }
      );
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          code: '000000',
          data: mockResult
        })
      );
    });

    it('should list movies with search parameters', async () => {
      mockReq.query = {
        page: '2',
        limit: '20',
        keyword: '阿甘正传',
        genres: '剧情',
        director: '罗伯特'
      };

      const mockResult = {
        movies: [{ title: '阿甘正传' }],
        total: 1,
        totalPages: 1,
        currentPage: 2
      };
      MovieService.listMovies.mockResolvedValue(mockResult);

      await MovieController.listMovies(mockReq, mockRes, mockNext);

      expect(MovieService.listMovies).toHaveBeenCalledWith(
        {
          keyword: '阿甘正传',
          genres: '剧情',
          director: '罗伯特'
        },
        { skip: 20, limit: 20 }
      );
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          code: '000000',
          data: mockResult
        })
      );
    });

    it('should handle errors', async () => {
      const error = new Error('Database error');
      MovieService.listMovies.mockRejectedValue(error);

      await MovieController.listMovies(mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });

  describe('createMovie', () => {
    it('should create a movie', async () => {
      const movieData = { title: 'New Movie' };
      mockReq.body = movieData;
      const mockMovie = { ...movieData, _id: 'movieId' };
      MovieService.createMovie.mockResolvedValue(mockMovie);

      await MovieController.createMovie(mockReq, mockRes, mockNext);

      expect(MovieService.createMovie).toHaveBeenCalledWith(movieData, 'testUserId');
      expect(mockRes.status).toHaveBeenCalledWith(201);
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          code: '000000',
          data: mockMovie
        })
      );
    });

    it('should handle errors', async () => {
      const error = new Error('Creation failed');
      MovieService.createMovie.mockRejectedValue(error);

      await MovieController.createMovie(mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });

  describe('getMovie', () => {
    it('should get a movie by id', async () => {
      const movieId = 'testMovieId';
      mockReq.params.id = movieId;
      const mockMovie = { _id: movieId, title: 'Test Movie' };
      MovieService.getMovie.mockResolvedValue(mockMovie);

      await MovieController.getMovie(mockReq, mockRes, mockNext);

      expect(MovieService.getMovie).toHaveBeenCalledWith(movieId);
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          code: '000000',
          data: mockMovie
        })
      );
    });

    it('should handle errors', async () => {
      const error = new Error('Movie not found');
      MovieService.getMovie.mockRejectedValue(error);

      await MovieController.getMovie(mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });

  describe('updateMovie', () => {
    it('should update a movie', async () => {
      const movieId = 'testMovieId';
      const updateData = { title: 'Updated Movie' };
      mockReq.params.id = movieId;
      mockReq.body = updateData;
      const mockMovie = { _id: movieId, ...updateData };
      MovieService.updateMovie.mockResolvedValue(mockMovie);

      await MovieController.updateMovie(mockReq, mockRes, mockNext);

      expect(MovieService.updateMovie).toHaveBeenCalledWith(movieId, updateData, 'testUserId');
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          code: '000000',
          data: mockMovie
        })
      );
    });

    it('should handle errors', async () => {
      const error = new Error('Update failed');
      MovieService.updateMovie.mockRejectedValue(error);

      await MovieController.updateMovie(mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });

  describe('deleteMovie', () => {
    it('should delete a movie', async () => {
      const movieId = 'testMovieId';
      mockReq.params.id = movieId;
      const mockMovie = { _id: movieId, title: 'Deleted Movie' };
      MovieService.deleteMovie.mockResolvedValue(mockMovie);

      await MovieController.deleteMovie(mockReq, mockRes, mockNext);

      expect(MovieService.deleteMovie).toHaveBeenCalledWith(movieId);
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          code: '000000',
          data: mockMovie
        })
      );
    });

    it('should handle errors', async () => {
      const error = new Error('Delete failed');
      MovieService.deleteMovie.mockRejectedValue(error);

      await MovieController.deleteMovie(mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });
});
