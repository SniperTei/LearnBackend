const UserMovieService = require('../../../src/services/userMovie.service');
const UserMovieDAL = require('../../../src/dal/userMovie.dal');
const MovieDAL = require('../../../src/dal/movie.dal');

// Mock DAL
jest.mock('../../../src/dal/userMovie.dal');
jest.mock('../../../src/dal/movie.dal');

describe('UserMovie Service Tests', () => {
  const mockUserId = 'user123';
  const mockMovieId = 'movie123';

  const mockMovie = {
    _id: mockMovieId,
    title: '测试电影',
    director: '导演1'
  };

  const mockUserMovie = {
    userId: mockUserId,
    movieId: mockMovieId,
    watchStatus: 'not_watched',
    wantToWatchStatus: 'N',
    likeStatus: 'N',
    rating: 0,
    review: null
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('updateUserMovie', () => {
    it('should create new user movie record if not exists', async () => {
      MovieDAL.findById.mockResolvedValue(mockMovie);
      UserMovieDAL.findOne.mockResolvedValue(null);
      UserMovieDAL.create.mockResolvedValue({
        ...mockUserMovie,
        watchStatus: 'watched'
      });

      const result = await UserMovieService.updateUserMovie(
        mockUserId,
        mockMovieId,
        { watchStatus: 'watched' }
      );

      expect(UserMovieDAL.create).toHaveBeenCalled();
      expect(result.watchStatus).toBe('watched');
    });

    it('should update existing user movie record', async () => {
      MovieDAL.findById.mockResolvedValue(mockMovie);
      UserMovieDAL.findOne.mockResolvedValue(mockUserMovie);
      UserMovieDAL.update.mockResolvedValue({
        ...mockUserMovie,
        watchStatus: 'watched'
      });

      const result = await UserMovieService.updateUserMovie(
        mockUserId,
        mockMovieId,
        { watchStatus: 'watched' }
      );

      expect(UserMovieDAL.update).toHaveBeenCalled();
      expect(result.watchStatus).toBe('watched');
    });

    it('should throw error if movie not found', async () => {
      MovieDAL.findById.mockResolvedValue(null);

      await expect(
        UserMovieService.updateUserMovie(mockUserId, mockMovieId, {})
      ).rejects.toThrow('未找到电影');
    });
  });

  describe('getUserMovie', () => {
    it('should return user movie record', async () => {
      UserMovieDAL.findOne.mockResolvedValue(mockUserMovie);

      const result = await UserMovieService.getUserMovie(mockUserId, mockMovieId);

      expect(result).toEqual(mockUserMovie);
    });

    it('should throw error if record not found', async () => {
      UserMovieDAL.findOne.mockResolvedValue(null);

      await expect(
        UserMovieService.getUserMovie(mockUserId, mockMovieId)
      ).rejects.toThrow('未找到观影记录');
    });
  });

  describe('listUserMovies', () => {
    const mockUserMovies = {
      userMovies: [mockUserMovie],
      total: 1
    };

    it('should return watched movies', async () => {
      UserMovieDAL.findWatchedMovies.mockResolvedValue(mockUserMovies);

      const result = await UserMovieService.listUserMovies(
        mockUserId,
        { status: 'watched' },
        { skip: 0, limit: 10 }
      );

      expect(result).toEqual({
        userMovies: mockUserMovies.userMovies,
        total: 1,
        totalPages: 1,
        currentPage: 1
      });
    });

    it('should return want to watch movies', async () => {
      UserMovieDAL.findWantToWatchMovies.mockResolvedValue(mockUserMovies);

      const result = await UserMovieService.listUserMovies(
        mockUserId,
        { status: 'want_to_watch' },
        { skip: 0, limit: 10 }
      );

      expect(result).toEqual({
        userMovies: mockUserMovies.userMovies,
        total: 1,
        totalPages: 1,
        currentPage: 1
      });
    });
  });

  describe('markAsWatched', () => {
    it('should mark movie as watched with rating and review', async () => {
      MovieDAL.findById.mockResolvedValue(mockMovie);
      UserMovieDAL.findOne.mockResolvedValue(mockUserMovie);
      UserMovieDAL.update.mockResolvedValue({
        ...mockUserMovie,
        watchStatus: 'watched',
        rating: 4,
        review: '很好看'
      });

      const result = await UserMovieService.markAsWatched(
        mockUserId,
        mockMovieId,
        4,
        '很好看'
      );

      expect(result.watchStatus).toBe('watched');
      expect(result.rating).toBe(4);
      expect(result.review).toBe('很好看');
    });
  });

  describe('toggleLike', () => {
    it('should toggle like status from N to Y', async () => {
      MovieDAL.findById.mockResolvedValue(mockMovie);
      UserMovieDAL.findOne.mockResolvedValue(mockUserMovie);
      UserMovieDAL.update.mockResolvedValue({
        ...mockUserMovie,
        likeStatus: 'Y'
      });

      const result = await UserMovieService.toggleLike(mockUserId, mockMovieId);

      expect(result.likeStatus).toBe('Y');
    });

    it('should toggle like status from Y to N', async () => {
      MovieDAL.findById.mockResolvedValue(mockMovie);
      UserMovieDAL.findOne.mockResolvedValue({
        ...mockUserMovie,
        likeStatus: 'Y'
      });
      UserMovieDAL.update.mockResolvedValue({
        ...mockUserMovie,
        likeStatus: 'N'
      });

      const result = await UserMovieService.toggleLike(mockUserId, mockMovieId);

      expect(result.likeStatus).toBe('N');
    });
  });

  describe('getUserStats', () => {
    it('should return user movie statistics', async () => {
      const mockStats = {
        watchedCount: 10,
        wantToWatchCount: 5,
        likedCount: 8,
        reviewCount: 6
      };

      UserMovieDAL.findUserMovieStats.mockResolvedValue(mockStats);

      const result = await UserMovieService.getUserStats(mockUserId);

      expect(result).toEqual(mockStats);
    });
  });
});
