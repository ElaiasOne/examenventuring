import { Link } from "react-router-dom";
import './navbar.css';

export default function Navbar() {
  return (
    <div className="navbar-container"> {/* Agregar el contenedor con la clase "navbar-container" */}
      <nav className="navbar">
        <ul>
          <li>
            <Link to="/" className="active">Subir CSV</Link>
          </li>
          <li>
            <Link to="/movies">Listado de películas</Link>
          </li>
          <li>
            <Link to="/add">Agregar Película</Link>
          </li>
        </ul>

        <hr />
      </nav>
    </div>
  );
}
