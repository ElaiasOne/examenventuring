import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

// Importa tus componentes de las pantallas
import UploadCSVScreen from "./screens/UploadCSVScreen";
import MovieListScreen from "./screens/MovieListScreen";
import AddEditMovieScreen from "./screens/AddEditMovieScreen";
import Navbar from "./components/Navbar";

function App() {
  return (
    <Router>
      <Navbar />
      <Switch>
        <Route exact path="/" component={UploadCSVScreen} />
        <Route path="/movies" component={MovieListScreen} />
        <Route path="/add" component={AddEditMovieScreen} />
        <Route path="/edit/:id" component={AddEditMovieScreen} />
      </Switch>
    </Router>
  );
}

export default App;
