const movieModel = require('../model/movie');
const moment = require('moment');

const movieService = {
  queryMovieList: async (params) => {
    let page = 1;
    let limit = 10;
    if (params.page) {
      page = parseInt(params.page);
    }
    if (params.limit) {
      limit = parseInt(params.limit);
    }
    try {
      // 获取第一页的10个电影列表
      let movieList = await movieModel.find().skip((page - 1) * limit).limit(limit);
      // 循环遍历movieList， 使用moment把字符串release_date转换为yyyy-MM-dd格式
      movieList = movieList.map(movie => {
        let release_date = moment(movie.release_date).format('YYYY-MM-DD');
        return {
          ...movie._doc,
          release_date,
        };
      });
      // 所有电影的总数
      let total = await movieModel.countDocuments();
      return { msg: 'Query movie list success', data: { list: movieList, total: total} };
    } catch (error) {
      throw new Error(error.message);
    }
  },
  addMovie: async (params) => {
    try {
      const { title, genre, country, release_date, description, image, duration, jyp_viewed, sniper_viewed } = params;
      const newMovie = new movieModel({
        title,
        genre,
        country,
        release_date,
        description,
        image,
        duration,
        jyp_viewed,
        sniper_viewed,
      });
      await newMovie.save();
      return { msg: 'Add movie success' };
    } catch (error) {
      throw new Error(error.message);
    }
  },
  addTestDatas: async () => {

    const movies = [
      {
          title: "Inception",
          genre: ["Action", "Sci-Fi"],
          country: "USA",
          release_date: new Date("2010-07-16"),
          description: "A thief who steals corporate secrets using dream-sharing technology.",
          image: "https://example.com/images/inception.jpg",
          duration: 148,
          jyp_viewed: "yes",
          sniper_viewed: "no",
      },
      {
          title: "Parasite",
          genre: ["Thriller", "Drama"],
          country: "South Korea",
          release_date: new Date("2019-05-30"),
          description: "A poor family schemes to become employed by a wealthy family.",
          image: "https://example.com/images/parasite.jpg",
          duration: 132,
          jyp_viewed: "no",
          sniper_viewed: "yes",
      },
      {
          title: "The Godfather",
          genre: ["Crime", "Drama"],
          country: "USA",
          release_date: new Date("1972-03-24"),
          description: "An organized crime dynasty's aging patriarch transfers control to his reluctant son.",
          image: "https://example.com/images/godfather.jpg",
          duration: 175,
          jyp_viewed: "yes",
          sniper_viewed: "yes",
      },
      {
          title: "The Dark Knight",
          genre: ["Action", "Crime"],
          country: "USA",
          release_date: new Date("2008-07-18"),
          description: "When the menace known as the Joker emerges from his mysterious past, he wreaks havoc.",
          image: "https://example.com/images/dark_knight.jpg",
          duration: 152,
          jyp_viewed: "yes",
          sniper_viewed: "no",
      },
      {
          title: "Forrest Gump",
          genre: ["Drama", "Romance"],
          country: "USA",
          release_date: new Date("1994-07-06"),
          description: "The presidencies of Kennedy and Johnson, the Vietnam War, the Watergate scandal.",
          image: "https://example.com/images/forrest_gump.jpg",
          duration: 142,
          jyp_viewed: "no",
          sniper_viewed: "yes",
      },
      {
          title: "Interstellar",
          genre: ["Adventure", "Sci-Fi"],
          country: "USA",
          release_date: new Date("2014-11-07"),
          description: "A team of explorers travels through a wormhole in space in an attempt to ensure humanity's survival.",
          image: "https://example.com/images/interstellar.jpg",
          duration: 169,
          jyp_viewed: "yes",
          sniper_viewed: "no",
      },
      {
          title: "The Matrix",
          genre: ["Action", "Sci-Fi"],
          country: "USA",
          release_date: new Date("1999-03-31"),
          description: "A computer hacker learns about the true nature of his reality.",
          image: "https://example.com/images/matrix.jpg",
          duration: 136,
          jyp_viewed: "yes",
          sniper_viewed: "yes",
      },
      {
          title: "Titanic",
          genre: ["Drama", "Romance"],
          country: "USA",
          release_date: new Date("1997-12-19"),
          description: "A seventeen-year-old aristocrat falls in love with a kind but poor artist aboard the luxurious R.M.S. Titanic.",
          image: "https://example.com/images/titanic.jpg",
          duration: 195,
          jyp_viewed: "no",
          sniper_viewed: "yes",
      },
      {
          title: "Gladiator",
          genre: ["Action", "Drama"],
          country: "USA",
          release_date: new Date("2000-05-05"),
          description: "A former Roman general sets out to exact vengeance against the corrupt emperor who murdered his family.",
          image: "https://example.com/images/gladiator.jpg",
          duration: 155,
          jyp_viewed: "yes",
          sniper_viewed: "no",
      },
      {
          title: "Avatar",
          genre: ["Action", "Adventure"],
          country: "USA",
          release_date: new Date("2009-12-18"),
          description: "A paraplegic Marine dispatched to the moon Pandora on a unique mission.",
          image: "https://example.com/images/avatar.jpg",
          duration: 162,
          jyp_viewed: "yes",
          sniper_viewed: "yes",
      },
      {
          title: "The Shawshank Redemption",
          genre: ["Drama"],
          country: "USA",
          release_date: new Date("1994-09-23"),
          description: "Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.",
          image: "https://example.com/images/shawshank.jpg",
          duration: 142,
          jyp_viewed: "no",
          sniper_viewed: "yes",
      },
      {
          title: "The Social Network",
          genre: ["Biography", "Drama"],
          country: "USA",
          release_date: new Date("2010-10-01"),
          description: "As Harvard students create the social networking site that would become known as Facebook.",
          image: "https://example.com/images/social_network.jpg",
          duration: 120,
          jyp_viewed: "no",
          sniper_viewed: "no",
      },
      {
          title: "12 Angry Men",
          genre: ["Drama"],
          country: "USA",
          release_date: new Date("1957-04-10"),
          description: "A jury holdout attempts to prevent a miscarriage of justice by forcing his colleagues to reconsider the evidence.",
          image: "https://example.com/images/12_angry_men.jpg",
          duration: 96,
          jyp_viewed: "no",
          sniper_viewed: "yes",
      },
      {
          title: "The Silence of the Lambs",
          genre: ["Crime", "Drama", "Thriller"],
          country: "USA",
          release_date: new Date("1991-02-14"),
          description: "A young FBI cadet must confine the all-too-human Hannibal Lecter to catch another killer.",
          image: "https://example.com/images/silence_of_the_lambs.jpg",
          duration: 118,
          jyp_viewed: "yes",
          sniper_viewed: "no",
      },
      {
          title: "Saving Private Ryan",
          genre: ["Drama", "War"],
          country: "USA",
          release_date: new Date("1998-09-11"),
          description: "In the midst of World War II, Captain Miller and his squad are assigned to retrieve a paratrooper.",
          image: "https://example.com/images/saving_private_ryan.jpg",
          duration: 169,
          jyp_viewed: "yes",
          sniper_viewed: "yes",
      },
    ];
    await movieModel.insertMany(movies);
    return { msg: 'Add test data success' };
  }
}

module.exports = movieService;