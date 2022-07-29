const express = require("express");
const router = express.Router();
const axios = require("axios");

let artistSearch;
let titleSearch;

const filterData = (song) => {
  const songData = {};

  if (artistSearch != undefined && titleSearch != undefined) {
    if (
      artistSearch.toLowerCase() == song.result.artist_names.toLowerCase() &&
      song.result.title.search(titleSearch.toLowerCase())
    ) {
      songData.songId = song.result.id;
      songData.artist = song.result.artist_names;
      songData.title = song.result.title;
    }
  } else {
    if (artistSearch != undefined && titleSearch == undefined) {
      if (artistSearch.toLowerCase() === song.result.artist_names.toLowerCase()) {
        songData.songId = song.result.id;
        songData.artist = song.result.artist_names;
        songData.title = song.result.title;
      }
    }
    if (titleSearch != undefined && artistSearch == undefined) {
      if (song.result.title.search(titleSearch.toLowerCase())) {
        songData.songId = song.result.id;
        songData.artist = song.result.artist_names;
        songData.title = song.result.title;
      }
    }
  }
  return songData;
};

router.get("/get-songs", async (req, res) => {
  const { artist, title } = req.query;

  let queryData;
  artistSearch = artist;
  titleSearch = title;

  if (artist != undefined && title != undefined) {
    queryData = `${artist} ${title}`;
  }
  if (artist != undefined && title == undefined) {
    queryData = artist;
  }
  if (title != undefined && artist == undefined) {
    queryData = title;
  }

  try {
    axios
      .request({
        method: "GET",
        url: "https://genius-song-lyrics1.p.rapidapi.com/search",
        params: { q: `${queryData}`, per_page: "20", page: "1" },
        headers: {
          "X-RapidAPI-Key": process.env.APIKEY,
          "X-RapidAPI-Host": process.env.APIHOST,
        },
      })
      .then((response) => {
        const songsFound = response.data.response.hits.map((song) => filterData(song));
        const songsList = songsFound.filter((song) => Object.entries(song).length > 0);
        res.json(songsList);
      })
      .catch(function (error) {
        res.status(500).json({
          msg: "Error loading data from database",
          error,
        });
      });
  } catch (error) {
    res.status(500).json({
      msg: "Error getting data from database",
      error,
    });
  }
});

router.get("/get-lyric", async (req, res) => {
  const { songId } = req.query;
  try {
    axios
      .request({
        method: "GET",
        url: `https://genius-song-lyrics1.p.rapidapi.com/songs/${songId}/lyrics`,
        headers: {
          "X-RapidAPI-Key": process.env.APIKEY,
          "X-RapidAPI-Host": process.env.APIHOST,
        },
      })
      .then(function (response) {
        res.json(response.data.response.lyrics.lyrics.body.html);
      })
      .catch(function (error) {
        console.log(error);
      });
  } catch (error) {
    res.status(500).json({
      msg: "Error getting data from database",
      error,
    });
  }
});

module.exports = router;
