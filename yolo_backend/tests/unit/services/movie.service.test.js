const MovieService = require('../../../src/services/movie.service');
const MovieDAL = require('../../../src/dal/movie.dal');
const UserMovieDAL = require('../../../src/dal/userMovie.dal');

jest.mock('../../../src/dal/movie.dal');
jest.mock('../../../src/dal/userMovie.dal');

describe('Movie Service Tests', () => {
  let movieService;
  const mockUserId = 'testUserId';
  const mockMovieId = 'testMovieId';
  const mockMovie = {
    _id: mockMovieId,
    title: '测试电影',
    description: '测试描述',
    toObject: () => ({
      _id: mockMovieId,
      title: '测试电影',
      description: '测试描述'
    })
  };

  beforeEach(() => {
    movieService = new MovieService();
    jest.clearAllMocks();
  });

  describe('createMovie', () => {
    it('should create a new movie', async () => {
      MovieDAL.findByMovieUni.mockResolvedValue(null);
      MovieDAL.create.mockResolvedValue(mockMovie);

      const result = await movieService.createMovie(mockMovie, mockUserId);

      expect(MovieDAL.create).toHaveBeenCalledWith({
        ...mockMovie,
        createdBy: mockUserId,
        updatedBy: mockUserId
      });
      expect(result).toEqual({
        movieId: mockMovieId,
        title: '测试电影',
        description: '测试描述'
      });
    });

    it('should throw error if movieUni already exists', async () => {
      const existingMovie = { ...mockMovie, movieUni: 'MOVIE001' };
      MovieDAL.findByMovieUni.mockResolvedValue(existingMovie);

      await expect(
        movieService.createMovie({ ...mockMovie, movieUni: 'MOVIE001' }, mockUserId)
      ).rejects.toThrow('电影ID已存在');
    });
  });

  describe('listMovies', () => {
    const mockListResult = {
      movies: [mockMovie],
      total: 1
    };

    it('should list movies with default query', async () => {
      MovieDAL.findAll.mockResolvedValue(mockListResult);

      const result = await movieService.listMovies(
        {},
        { skip: 0, limit: 10 }
      );

      expect(MovieDAL.findAll).toHaveBeenCalledWith({}, { skip: 0, limit: 10 });
      expect(result).toEqual({
        movies: [{
          movieId: mockMovieId,
          title: '测试电影',
          description: '测试描述'
        }],
        total: 1,
        totalPages: 1,
        currentPage: 1
      });
    });

    it('should search movies by keyword', async () => {
      MovieDAL.search.mockResolvedValue(mockListResult);

      const result = await movieService.listMovies(
        { keyword: '测试' },
        { skip: 0, limit: 10 }
      );

      expect(MovieDAL.search).toHaveBeenCalledWith('测试', { skip: 0, limit: 10 });
      expect(result.movies).toHaveLength(1);
    });

    it('should search movies by genres', async () => {
      MovieDAL.findByGenres.mockResolvedValue(mockListResult);

      const result = await movieService.listMovies(
        { genres: ['动作'] },
        { skip: 0, limit: 10 }
      );

      expect(MovieDAL.findByGenres).toHaveBeenCalledWith(['动作'], { skip: 0, limit: 10 });
      expect(result.movies).toHaveLength(1);
    });

    it('should search movies by actors', async () => {
      MovieDAL.findByActors.mockResolvedValue(mockListResult);

      const result = await movieService.listMovies(
        { actors: ['演员1'] },
        { skip: 0, limit: 10 }
      );

      expect(MovieDAL.findByActors).toHaveBeenCalledWith(['演员1'], { skip: 0, limit: 10 });
      expect(result.movies).toHaveLength(1);
    });

    it('should search movies by director', async () => {
      MovieDAL.findByDirector.mockResolvedValue(mockListResult);

      const result = await movieService.listMovies(
        { director: '导演1' },
        { skip: 0, limit: 10 }
      );

      expect(MovieDAL.findByDirector).toHaveBeenCalledWith('导演1', { skip: 0, limit: 10 });
      expect(result.movies).toHaveLength(1);
    });
  });

  describe('getMovie', () => {
    it('should get movie by id with stats', async () => {
      const mockMovieStats = { watchCount: 10, avgRating: 4.5 };
      MovieDAL.findById.mockResolvedValue(mockMovie);
      UserMovieDAL.findMovieStats.mockResolvedValue(mockMovieStats);

      const result = await movieService.getMovie(mockMovieId);

      expect(MovieDAL.findById).toHaveBeenCalledWith(mockMovieId);
      expect(UserMovieDAL.findMovieStats).toHaveBeenCalledWith(mockMovieId);
      expect(result).toEqual({
        movieId: mockMovieId,
        title: '测试电影',
        description: '测试描述',
        stats: mockMovieStats
      });
    });

    it('should throw error if movie not found', async () => {
      MovieDAL.findById.mockResolvedValue(null);

      await expect(movieService.getMovie(mockMovieId))
        .rejects
        .toThrow('未找到电影');
    });
  });

  describe('updateMovie', () => {
    const updateData = {
      title: '更新的电影',
      description: '更新的描述'
    };

    it('should update movie', async () => {
      MovieDAL.findById.mockResolvedValue(mockMovie);
      const updatedMovie = {
        ...mockMovie,
        title: '更新的电影',
        description: '更新的描述',
        toObject: () => ({
          _id: mockMovieId,
          title: '更新的电影',
          description: '更新的描述'
        })
      };
      MovieDAL.update.mockResolvedValue(updatedMovie);

      const result = await movieService.updateMovie(mockMovieId, updateData, mockUserId);

      expect(MovieDAL.update).toHaveBeenCalledWith(mockMovieId, {
        ...updateData,
        updatedBy: mockUserId
      });
      expect(result).toEqual({
        movieId: mockMovieId,
        title: '更新的电影',
        description: '更新的描述'
      });
    });

    it('should throw error if movie not found', async () => {
      MovieDAL.findById.mockResolvedValue(null);

      await expect(movieService.updateMovie(mockMovieId, updateData, mockUserId))
        .rejects
        .toThrow('未找到电影');
    });

    it('should throw error if new movieUni already exists', async () => {
      const existingMovie = { ...mockMovie, _id: 'otherId', movieUni: 'MOVIE002' };
      MovieDAL.findById.mockResolvedValue(mockMovie);
      MovieDAL.findByMovieUni.mockResolvedValue(existingMovie);

      await expect(movieService.updateMovie(mockMovieId, { movieUni: 'MOVIE002' }, mockUserId))
        .rejects
        .toThrow('电影ID已存在');
    });
  });

  describe('deleteMovie', () => {
    it('should delete movie', async () => {
      MovieDAL.findById.mockResolvedValue(mockMovie);
      MovieDAL.delete.mockResolvedValue(mockMovie);

      const result = await movieService.deleteMovie(mockMovieId);

      expect(MovieDAL.delete).toHaveBeenCalledWith(mockMovieId);
      expect(result).toEqual({
        movieId: mockMovieId,
        title: '测试电影',
        description: '测试描述'
      });
    });

    it('should throw error if movie not found', async () => {
      MovieDAL.findById.mockResolvedValue(null);

      await expect(movieService.deleteMovie(mockMovieId))
        .rejects
        .toThrow('未找到电影');
    });
  });
});
