const express = require("express");
const multer = require("multer");
const csv = require("csv-parser");
const mysql = require("mysql2");
const cors = require("cors");
const fs = require("fs");

const app = express();
const PORT = 3005;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// Configuración de la conexión a la base de datos MySQL
const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "movies_db",
});

// Conexión a la base de datos MySQL
connection.connect((err) => {
  if (err) {
    console.error("Error al conectar a la base de datos:", err);
  } else {
    console.log("Conexión exitosa a la base de datos");
  }
});

// Configuración de multer para la subida de archivos
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });

// Endpoint para importar películas desde un archivo CSV
app.post("/api/movies/import", upload.single("csvFile"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No se encontró un archivo CSV" });
  }

  const moviesToImport = [];

  fs.createReadStream(req.file.path)
    .pipe(csv({ separator: ";", headers: ["title", "description", "year"] }))
    .on("data", (data) => {
      moviesToImport.push(data);
    })
    .on("end", () => {
      const moviesToAdd = moviesToImport.filter(
        (movie) => !movieExists(movie.title)
      );

      const query = "INSERT INTO movies (title, description, year) VALUES ?";

      // filtro repetidos en el csv
      const uniqueMovies = [];
      const seenTitles = new Set();

      moviesToAdd.forEach((movie) => {
        if (!seenTitles.has(movie.title)) {
          seenTitles.add(movie.title);
          uniqueMovies.push(movie);
        }
      });

      const values = uniqueMovies.map((movie) => [
        movie.title,
        movie.description,
        Number(movie.year),
      ]);

      connection.query(query, [values], (err, results) => {
        if (err) {
          return res
            .status(500)
            .json({ message: "Error al importar las películas" });
        }

        res.json({ message: "Películas importadas correctamente" });
      });
    });
});

// Endpoint para obtener el listado de películas
app.get("/api/movies", (req, res) => {
  const { title, page } = req.query;
  const limit = 10;
  const offset = (page - 1) * limit;

  let query = "SELECT * FROM movies";

  if (title) {
    query += ` WHERE title LIKE '%${title}%'`;
  }

  query += ` LIMIT ${limit} OFFSET ${offset}`;

  connection.query(query, (err, results) => {
    if (err) {
      return res
        .status(500)
        .json({ message: "Error al obtener el listado de películas" });
    }

    res.json(results);
  });
});

// Endpoint para agregar una nueva película
app.post("/api/movies", (req, res) => {
  const { title, description, year } = req.body;

  if (!title || !description || !year) {
    return res.status(400).json({ message: "Datos incompletos" });
  }

  if (movieExists(title)) {
    return res
      .status(409)
      .json({ message: "Ya existe una película con ese título" });
  }

  const query =
    "INSERT INTO movies (title, description, year) VALUES (?, ?, ?)";

  connection.query(query, [title, description, year], (err, results) => {
    if (err) {
      return res.status(500).json({ message: "Error al agregar la película" });
    }

    res.json({ message: "Película agregada correctamente" });
  });
});

// Endpoint para obtener una película por su ID
app.get("/api/movies/:id", (req, res) => {
  const { id } = req.params;

  const query = "SELECT * FROM movies WHERE id = ?";

  connection.query(query, [id], (err, results) => {
    if (err) {
      return res.status(500).json({ message: "Error al obtener la película" });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: "Película no encontrada" });
    }

    res.json(results[0]);
  });
});

// Endpoint para actualizar una película
app.put("/api/movies/:id", (req, res) => {
  const { id } = req.params;
  const { title, description, year } = req.body;

  if (!title || !description || !year) {
    return res.status(400).json({ message: "Datos incompletos" });
  }

  const query =
    "UPDATE movies SET title = ?, description = ?, year = ? WHERE id = ?";

  connection.query(query, [title, description, year, id], (err, results) => {
    if (err) {
      return res
        .status(500)
        .json({ message: "Error al actualizar la película" });
    }

    if (results.affectedRows === 0) {
      return res.status(404).json({ message: "Película no encontrada" });
    }

    res.json({ message: "Película actualizada correctamente" });
  });
});

// Endpoint para eliminar una película
app.delete("/api/movies/:id", (req, res) => {
  const { id } = req.params;

  const query = "DELETE FROM movies WHERE id = ?";

  connection.query(query, [id], (err, results) => {
    if (err) {
      return res.status(500).json({ message: "Error al eliminar la película" });
    }

    if (results.affectedRows === 0) {
      return res.status(404).json({ message: "Película no encontrada" });
    }

    res.json({ message: "Película eliminada correctamente" });
  });
});

// Función auxiliar para verificar si una película ya existe en la base de datos
function movieExists(title) {
  const query = "SELECT * FROM movies WHERE title = ?";

  const result = connection.query(query, [title]);

  return result.length > 0;
}

app.listen(PORT, () => {
  console.log(`Servidor backend ejecutándose en http://localhost:${PORT}`);
});
