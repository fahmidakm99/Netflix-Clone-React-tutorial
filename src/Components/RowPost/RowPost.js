import React, { useEffect, useState } from "react";
import "./RowPost.css";
import YouTube from "react-youtube";
import axios from "../axios";
import { API_KEY, imageUrl } from "../../constants/constants";

function RowPost(props) {
  const [movies, setMovies] = useState([]);
  const [trailerid, setTrailerid] = useState("");       // current trailer key
  const [activeMovieId, setActiveMovieId] = useState(null); // currently open movie

  useEffect(() => {
    axios.get(props.url).then((response) => {
      setMovies(response.data.results);
    });
  }, [props.url]);

  const opts = {
    height: "390",
    width: "640",
    playerVars: {
      autoplay: 1,
    },
  };

  const handleMovie = (id) => {
    // Same movie clicked → toggle trailer
    if (activeMovieId === id) {
      setTrailerid("");
      setActiveMovieId(null);
      return;
    }

    // Different movie clicked → fetch new trailer
    axios
      .get(`/movie/${id}/videos?api_key=${API_KEY}&language=en-US`)
      .then((response) => {
        if (response.data.results.length > 0) {
          setTrailerid(response.data.results[0].key);
          setActiveMovieId(id);
        } else {
          console.log("No trailer found");
          setTrailerid("");
          setActiveMovieId(null);
        }
      })
      .catch((err) => {
        console.log(err);
        setTrailerid("");
        setActiveMovieId(null);
      });
  };

  return (
    <div className="row">
      <h2>{props.title}</h2>
      <div className="posters">
        {movies.map((obj) => (
          <img
            key={obj.id}
            className={props.isSmall ? "small-poster" : "poster"}
            src={`${imageUrl}${props.isSmall ? obj.poster_path : obj.backdrop_path}`}
            alt="poster"
            onClick={() => handleMovie(obj.id)}
          />
        ))}
      </div>
      {/* npm i react-youtube  */}
      {trailerid && <YouTube key={trailerid} videoId={trailerid} opts={opts} />}
    </div>
  );
}

export default RowPost;