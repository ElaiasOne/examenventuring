import React, { useState } from "react";
import axios from "axios";
import { SERVER_URL } from "../utils/constants";
import "./UploadCSVScreen.css"

function UploadCSV() {
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleUpload = () => {
    const formData = new FormData();
    formData.append("csvFile", selectedFile);

    axios
      .post(SERVER_URL + "/api/movies/import", formData)
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
    <div className="upload-csv-container">
      <div className="upload-csv">
        <h2>Subir archivo CSV</h2>
        <input type="file" accept=".csv" onChange={handleFileChange} />
        <button onClick={handleUpload} disabled={!selectedFile}>
          Subir
        </button>
      </div>
    </div>
  );
}

export default UploadCSV;
