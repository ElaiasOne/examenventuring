import React, { useState, useEffect } from "react";
import axios from "axios";
import { SERVER_URL } from "../utils/constants";
import "./MovieListScreen.css"

function MovieList() {
  const [movies, setMovies] = useState([]);
  const [searchTitle, setSearchTitle] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const fetchMovies = () => {
    const queryParams = {
      title: searchTitle,
      page: currentPage,
    };

    axios
      .get(SERVER_URL + "/api/movies", { params: queryParams })
      .then((response) => {
        setMovies(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const handleSearch = () => {
    setCurrentPage(1);
    fetchMovies();
  };

  const handleDeleteMovie = (id) => {
    // Aquí realizas la solicitud DELETE para eliminar la película con el ID especificado
    axios
      .delete(`${SERVER_URL}/api/movies/${id}`)
      .then((response) => {
        console.log(response.data.message);
        fetchMovies(); // Actualizas la lista de películas después de la eliminación
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  useEffect(() => {
    fetchMovies();
  }, []);

  return (
    <div className="container">
      <h2 className="heading">Listado de películas</h2>
      <div className="search-container">
        <input
          type="text"
          value={searchTitle}
          onChange={(e) => setSearchTitle(e.target.value)}
          className="search-input"
        />
        <button onClick={handleSearch} className="search-button">
          Buscar
        </button>
      </div>
      <table>
        <thead>
          <tr>
            <th>Título</th>
            <th>Descripción</th>
            <th>Año</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {movies.map((movie) => (
            <tr key={movie.id}>
              <td>{movie.title}</td>
              <td>{movie.description}</td>
              <td>{movie.year}</td>
              <td>
                <button onClick={() => handleDeleteMovie(movie.id)}>Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="pagination-container">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="pagination-button"
        >
          Anterior
        </button>
        <span className="page-number">Página {currentPage}</span>
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          className="pagination-button"
        >
          Siguiente
        </button>
      </div>
    </div>
  );
}

export default MovieList;
