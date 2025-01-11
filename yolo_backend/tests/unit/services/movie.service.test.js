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
    it('should return movies with pagination', async () => {
      const mockMovies = [mockMovie, { ...mockMovie, _id: 'movie456' }];
      MovieDAL.findAll.mockResolvedValue({
        movies: mockMovies,
        total: 2
      });

      const options = { skip: 0, limit: 10 };
      const result = await MovieService.listMovies({}, options);

      expect(result).toEqual({
        movies: mockMovies,
        total: 2,
        totalPages: 1,
        currentPage: 1
      });
    });
  });

  describe('getMovie', () => {
    it('should return movie with stats', async () => {
      MovieDAL.findById.mockResolvedValue(mockMovie);
      UserMovieDAL.findMovieStats.mockResolvedValue(mockMovieStats);

      const result = await MovieService.getMovie(mockMovieId);

      expect(result).toEqual({
        ...mockMovie,
        stats: mockMovieStats
      });
    });

    it('should throw error if movie not found', async () => {
      MovieDAL.findById.mockResolvedValue(null);

      await expect(
        MovieService.getMovie(mockMovieId)
      ).rejects.toThrow('未找到电影');
    });
  });

  describe('updateMovie', () => {
    const updateData = { title: '更新后的电影' };

    it('should update movie', async () => {
      MovieDAL.findById.mockResolvedValue(mockMovie);
      MovieDAL.update.mockResolvedValue({ ...mockMovie, ...updateData });

      const result = await MovieService.updateMovie(mockMovieId, updateData, mockUserId);

      expect(MovieDAL.update).toHaveBeenCalledWith(mockMovieId, {
        ...updateData,
        updatedBy: mockUserId
      });
      expect(result.title).toBe(updateData.title);
    });

    it('should throw error if movie not found', async () => {
      MovieDAL.findById.mockResolvedValue(null);

      await expect(
        MovieService.updateMovie(mockMovieId, updateData, mockUserId)
      ).rejects.toThrow('未找到电影');
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

      await expect(
        MovieService.deleteMovie(mockMovieId)
      ).rejects.toThrow('未找到电影');
    });
  });

  describe('searchMovies', () => {
    const mockSearchResult = {
      movies: [mockMovie],
      total: 1
    };

    it('should search movies by keyword', async () => {
      MovieDAL.search.mockResolvedValue(mockSearchResult);

      const result = await MovieService.searchMovies(
        { keyword: '测试' },
        { skip: 0, limit: 10 }
      );

      expect(result).toEqual({
        movies: mockSearchResult.movies,
        total: 1,
        totalPages: 1,
        currentPage: 1
      });
    });

    it('should search movies by genres', async () => {
      MovieDAL.findByGenres.mockResolvedValue(mockSearchResult);

      const result = await MovieService.searchMovies(
        { genres: ['动作'] },
        { skip: 0, limit: 10 }
      );

      expect(result).toEqual({
        movies: mockSearchResult.movies,
        total: 1,
        totalPages: 1,
        currentPage: 1
      });
    });
  });
});
