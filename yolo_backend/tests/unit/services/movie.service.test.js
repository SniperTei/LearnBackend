const MovieService = require('../../../src/services/movie.service');
const MovieDAL = require('../../../src/dal/movie.dal');
const UserMovieDAL = require('../../../src/dal/userMovie.dal');

// Mock DAL
jest.mock('../../../src/dal/movie.dal');
jest.mock('../../../src/dal/userMovie.dal');

describe('Movie Service Tests', () => {
  const mockUserId = 'user123';
  const mockMovieId = 'movie123';

  const mockMovie = {
    _id: mockMovieId,
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
    synopsis: '剧情简介',
    toObject: function() { return this; }
  };

  const mockMovieStats = {
    watchCount: 10,
    wantToWatchCount: 5,
    likeCount: 8,
    averageRating: 4.5,
    reviewCount: 6
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createMovie', () => {
    it('should create a new movie', async () => {
      MovieDAL.findByMovieUni.mockResolvedValue(null);
      MovieDAL.create.mockResolvedValue(mockMovie);

      const result = await MovieService.createMovie(mockMovie, mockUserId);

      expect(MovieDAL.create).toHaveBeenCalledWith({
        ...mockMovie,
        createdBy: mockUserId,
        updatedBy: mockUserId
      });
      expect(result).toEqual(mockMovie);
    });

    it('should throw error if movieUni already exists', async () => {
      MovieDAL.findByMovieUni.mockResolvedValue(mockMovie);

      await expect(
        MovieService.createMovie({ ...mockMovie, movieUni: 'MOVIE001' }, mockUserId)
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

      const result = await MovieService.listMovies(
        {},
        { skip: 0, limit: 10 }
      );

      expect(result).toEqual({
        movies: mockListResult.movies,
        total: 1,
        totalPages: 1,
        currentPage: 1
      });
      expect(MovieDAL.findAll).toHaveBeenCalledWith({}, { skip: 0, limit: 10 });
    });

    it('should search movies by keyword', async () => {
      MovieDAL.search.mockResolvedValue(mockListResult);

      const result = await MovieService.listMovies(
        { keyword: '测试' },
        { skip: 0, limit: 10 }
      );

      expect(result).toEqual({
        movies: mockListResult.movies,
        total: 1,
        totalPages: 1,
        currentPage: 1
      });
      expect(MovieDAL.search).toHaveBeenCalledWith('测试', { skip: 0, limit: 10 });
    });

    it('should search movies by genres', async () => {
      MovieDAL.findByGenres.mockResolvedValue(mockListResult);

      const result = await MovieService.listMovies(
        { genres: ['动作'] },
        { skip: 0, limit: 10 }
      );

      expect(result).toEqual({
        movies: mockListResult.movies,
        total: 1,
        totalPages: 1,
        currentPage: 1
      });
      expect(MovieDAL.findByGenres).toHaveBeenCalledWith(['动作'], { skip: 0, limit: 10 });
    });

    it('should search movies by actors', async () => {
      MovieDAL.findByActors.mockResolvedValue(mockListResult);

      const result = await MovieService.listMovies(
        { actors: ['演员1'] },
        { skip: 0, limit: 10 }
      );

      expect(result).toEqual({
        movies: mockListResult.movies,
        total: 1,
        totalPages: 1,
        currentPage: 1
      });
      expect(MovieDAL.findByActors).toHaveBeenCalledWith(['演员1'], { skip: 0, limit: 10 });
    });

    it('should search movies by director', async () => {
      MovieDAL.findByDirector.mockResolvedValue(mockListResult);

      const result = await MovieService.listMovies(
        { director: '导演1' },
        { skip: 0, limit: 10 }
      );

      expect(result).toEqual({
        movies: mockListResult.movies,
        total: 1,
        totalPages: 1,
        currentPage: 1
      });
      expect(MovieDAL.findByDirector).toHaveBeenCalledWith('导演1', { skip: 0, limit: 10 });
    });
  });

  describe('getMovie', () => {
    it('should get movie by id with stats', async () => {
      MovieDAL.findById.mockResolvedValue(mockMovie);
      UserMovieDAL.findMovieStats.mockResolvedValue(mockMovieStats);

      const result = await MovieService.getMovie(mockMovieId);

      expect(MovieDAL.findById).toHaveBeenCalledWith(mockMovieId);
      expect(UserMovieDAL.findMovieStats).toHaveBeenCalledWith(mockMovieId);
      expect(result).toEqual({
        ...mockMovie,
        stats: mockMovieStats
      });
    });

    it('should throw error if movie not found', async () => {
      MovieDAL.findById.mockResolvedValue(null);

      await expect(MovieService.getMovie(mockMovieId))
        .rejects
        .toThrow('未找到电影');
    });
  });

  describe('updateMovie', () => {
    const updateData = {
      title: '更新的电影',
      movieUni: 'MOVIE002'
    };

    it('should update movie', async () => {
      MovieDAL.findById.mockResolvedValue(mockMovie);
      MovieDAL.findByMovieUni.mockResolvedValue(null);
      MovieDAL.update.mockResolvedValue({ ...mockMovie, ...updateData });

      const result = await MovieService.updateMovie(mockMovieId, updateData, mockUserId);

      expect(MovieDAL.update).toHaveBeenCalledWith(mockMovieId, {
        ...updateData,
        updatedBy: mockUserId
      });
      expect(result).toEqual({ ...mockMovie, ...updateData });
    });

    it('should throw error if movie not found', async () => {
      MovieDAL.findById.mockResolvedValue(null);

      await expect(MovieService.updateMovie(mockMovieId, updateData, mockUserId))
        .rejects
        .toThrow('未找到电影');
    });

    it('should throw error if new movieUni already exists', async () => {
      const existingMovie = { ...mockMovie, _id: 'other123', movieUni: 'MOVIE002' };
      MovieDAL.findById.mockResolvedValue(mockMovie);
      MovieDAL.findByMovieUni.mockResolvedValue(existingMovie);

      await expect(MovieService.updateMovie(mockMovieId, updateData, mockUserId))
        .rejects
        .toThrow('电影ID已存在');
    });
  });

  describe('deleteMovie', () => {
    it('should delete movie', async () => {
      MovieDAL.findById.mockResolvedValue(mockMovie);
      MovieDAL.delete.mockResolvedValue(mockMovie);

      const result = await MovieService.deleteMovie(mockMovieId);

      expect(MovieDAL.delete).toHaveBeenCalledWith(mockMovieId);
      expect(result).toEqual(mockMovie);
    });

    it('should throw error if movie not found', async () => {
      MovieDAL.findById.mockResolvedValue(null);

      await expect(MovieService.deleteMovie(mockMovieId))
        .rejects
        .toThrow('未找到电影');
    });
  });
});
