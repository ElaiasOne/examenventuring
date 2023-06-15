import React, { useState } from "react";
import axios from "axios";
import { SERVER_URL } from "../utils/constants";
import "./AddEditMovieScreen.js"

function AddEditMovie() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [year, setYear] = useState("");

  const handleSave = () => {
    const movieData = {
      title,
      description,
      year,
    };

    axios
      .post(SERVER_URL + "/api/movies", movieData)
      .then((response) => {
        console.log(response.data);
        // Lógica adicional, como mostrar un mensaje de éxito o redirigir a otra pantalla
      })
      .catch((error) => {
        console.error(error);
        // Lógica adicional, como mostrar un mensaje de error
      });
  };

  return (
    <div className="container">
      <h2 className="heading">Agregar/Editar Película</h2>
      <div>
        <label>Título:</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="input-field"
        />
      </div>
      <div>
        <label>Descripción:</label>
        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="input-field"
        />
      </div>
      <div>
        <label>Año:</label>
        <input
          type="text"
          value={year}
          onChange={(e) => setYear(e.target.value)}
          className="input-field"
        />
      </div>
      <button onClick={handleSave} className="save-button">
        Guardar
      </button>
    </div>
  );
}

export default AddEditMovie;
