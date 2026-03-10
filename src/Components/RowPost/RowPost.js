// import React, { useEffect, useState } from "react";
// import "./RowPost.css";
// import YouTube from "react-youtube";
// import axios from "../axios";
// import { API_KEY, imageUrl } from "../../constants/constants";

// function RowPost(props) {
//   const [movies, setMovies] = useState([]);
//   const [trailerid, setTrailerid] = useState("");       // current trailer key
//   const [activeMovieId, setActiveMovieId] = useState(null); // currently open movie

//   useEffect(() => {
//     axios.get(props.url).then((response) => {
//       setMovies(response.data.results);
//     });
//   }, [props.url]);

//   const opts = {
//     height: "390",
//     width: "640",
//     playerVars: {
//       autoplay: 1,
//     },
//   };

//   const handleMovie = (id) => {
//     // Same movie clicked → toggle trailer
//     if (activeMovieId === id) {
//       setTrailerid("");
//       setActiveMovieId(null);
//       return;
//     }

//     // Different movie clicked → fetch new trailer
//     axios
//       .get(`/movie/${id}/videos?api_key=${API_KEY}&language=en-US`)
//       .then((response) => {
//         if (response.data.results.length > 0) {
//           setTrailerid(response.data.results[0].key);
//           setActiveMovieId(id);
//         } else {
//           console.log("No trailer found");
//           setTrailerid("");
//           setActiveMovieId(null);
//         }
//       })
//       .catch((err) => {
//         console.log(err);
//         setTrailerid("");
//         setActiveMovieId(null);
//       });
//   };

//   return (
//     <div className="row">
//       <h2>{props.title}</h2>
//       <div className="posters">
//         {movies.map((obj) => (
//           <img
//             key={obj.id}
//             className={props.isSmall ? "small-poster" : "poster"}
//             src={`${imageUrl}${props.isSmall ? obj.poster_path : obj.backdrop_path}`}
//             alt="poster"
//             onClick={() => handleMovie(obj.id)}
//           />
//         ))}
//       </div>
//       {/* npm i react-youtube  */}
//       {trailerid && <YouTube key={trailerid} videoId={trailerid} opts={opts} />}
//     </div>
//   );
// }

// export default RowPost;

import React, { useEffect, useState } from "react";
import "./RowPost.css";
import YouTube from "react-youtube";
import axios from "../axios";
import { API_KEY, imageUrl } from "../../constants/constants";

function RowPost(props) {
  const [movies, setMovies] = useState([]);
  const [trailerid, setTrailerid] = useState("");       
  const [modalMovie, setModalMovie] = useState(null);    
  const [showTrailer, setShowTrailer] = useState(false); 
  const [modalTrailerId, setModalTrailerId] = useState(""); 
  const [cast, setCast] = useState([]);
  const [crew, setCrew] = useState([]);
  const [similarMovies, setSimilarMovies] = useState([]);

  useEffect(() => {
    axios.get(props.url)
      .then((response) => setMovies(response.data.results))
      .catch(() => setMovies([]));
  }, [props.url]);

  const fetchTrailer = async (movie) => {
    const mediaType = movie.media_type === "tv" ? "tv" : "movie";
    try {
      const res = await axios.get(`/${mediaType}/${movie.id}/videos?api_key=${API_KEY}&language=en-US`);
      if (res.data.results.length > 0) return res.data.results[0].key;
      return null;
    } catch (err) {
      return null;
    }
  };

  const openModal = async (movie) => {
    setModalMovie(movie);
    setModalTrailerId("");
    setTrailerid("");
    setShowTrailer(false);

    const trailerKey = await fetchTrailer(movie);
    setModalTrailerId(trailerKey || "");

    // Fetch Cast & Crew
    axios.get(`/movie/${movie.id}/credits?api_key=${API_KEY}&language=en-US`)
      .then((res) => {
        setCast(res.data.cast.slice(0, 5));
        setCrew(res.data.crew.slice(0, 3));
      })
      .catch(() => {
        setCast([]);
        setCrew([]);
      });

    // Fetch Similar Movies
    axios.get(`/movie/${movie.id}/similar?api_key=${API_KEY}&language=en-US`)
      .then((res) => setSimilarMovies(res.data.results.slice(0, 8)))
      .catch(() => setSimilarMovies([]));
  };

  const playTrailer = (trailerKey) => {
    setTrailerid(trailerKey);
    setShowTrailer(true);
    setModalMovie(null);
  };

  const closeTrailer = () => {
    setShowTrailer(false);
    setTrailerid("");
  };

  const opts = {
    width: "100%",
    height: "100%",
    playerVars: { autoplay: 1 },
  };

  return (
    <div className="row">
      <h2>{props.title}</h2>

      <div className="posters">
        {movies.map((movie) => (
          <img
            key={movie.id}
            className={props.isSmall ? "small-poster" : "poster"}
            src={`${imageUrl}${props.isSmall ? movie.poster_path : movie.backdrop_path}`}
            alt={movie.title}
            onClick={() => openModal(movie)}
          />
        ))}
      </div>

      {modalMovie && (
        <div className="modal">
          <div className="modal-content">
            <button className="close-btn" onClick={() => setModalMovie(null)}>✖</button>

            <img className="modal-img" src={`${imageUrl}${modalMovie.backdrop_path}`} alt={modalMovie.title} />
            <h2>{modalMovie.title}</h2>
            <p className="overview">{modalMovie.overview}</p>

            {cast.length > 0 && (
              <>
                <h3>Cast</h3>
                <p>{cast.map((actor) => actor.name).join(", ")}</p>
              </>
            )}

            {crew.length > 0 && (
              <>
                <h3>Crew</h3>
                <p>{crew.map((person) => person.name).join(", ")}</p>
              </>
            )}

            {modalTrailerId && (
              <button className="play-btn" onClick={() => playTrailer(modalTrailerId)}>▶ Play Trailer</button>
            )}

            {similarMovies.length > 0 && (
              <>
                <h3 className="more-title">More Like This</h3>
                <div className="similar-movies">
                  {similarMovies.map((movie) => (
                    <img
                      key={movie.id}
                      className="similar-poster"
                      src={`${imageUrl}${movie.poster_path}`}
                      alt={movie.title}
                      onClick={() => openModal(movie)}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {showTrailer && trailerid && (
        <div className="trailer-overlay">
          <button className="trailer-close" onClick={closeTrailer}>✖</button>
          <div className="trailer-content">
            <YouTube videoId={trailerid} opts={opts} />
          </div>
        </div>
      )}
    </div>
  );
}

export default RowPost;
