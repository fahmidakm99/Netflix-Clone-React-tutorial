import React, { useEffect, useState } from "react";
import "./Banner.css";
import YouTube from "react-youtube";
import axios from "../axios";
import { API_KEY, imageUrl } from "../../constants/constants";

function Banner() {
  const [movie, setMovie] = useState();
  const [trailerKey, setTrailerKey] = useState(""); // YouTube video key
  const [showModal, setShowModal] = useState(false); // modal toggle

  useEffect(() => {
    axios
      .get(`trending/all/week?api_key=${API_KEY}&language=en-US`)
      .then((response) => {
        const movies = response.data.results;
        const randomMovie = movies[Math.floor(Math.random() * movies.length)];
        setMovie(randomMovie);
      });
  }, []);

  const opts = {
    height: "480",
    width: "854",
    playerVars: {
      autoplay: 1,
      origin: window.location.origin,
      rel: 0,
    },
  };

  const handlePlay = () => {
    if (!movie) return;

    const mediaType = movie.media_type === "tv" ? "tv" : "movie";

    axios
      .get(`/${mediaType}/${movie.id}/videos?api_key=${API_KEY}&language=en-US`)
      .then((response) => {
        if (response.data.results.length > 0) {
          setTrailerKey(response.data.results[0].key);
          setShowModal(true); // open modal
        } else {
          console.log("No trailer available for this movie.");
        }
      })
      .catch((err) => console.log(err));
  };

  const closeModal = () => {
    setShowModal(false);
    setTrailerKey("");
  };

  return (
    <div
      style={{
        backgroundImage: `url(${movie ? imageUrl + movie.backdrop_path : ""})`,
      }}
      className="banner"
    >
      <div className="content">
        <h1 className="title">{movie ? movie.title || movie.name : ""}</h1>
        <div className="banner_buttons">
          <button className="button" onClick={handlePlay}>
            Play
          </button>
          <button className="button">My list</button>
        </div>
        <h1 className="description">{movie ? movie.overview : ""}</h1>
      </div>

      {/* Modal for trailer */}
      {showModal && (
        <div className="trailer-modal">
          <div className="trailer-content">
            <button className="close-btn" onClick={closeModal}>
              X
            </button>
            <YouTube videoId={trailerKey} opts={opts} />
          </div>
        </div>
      )}

      <div className="fade_bottom"></div>
    </div>
  );
}

export default Banner;