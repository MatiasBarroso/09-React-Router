import React, { useState } from "react";
import { Routes, Route } from "react-router-dom";
import "./App.css";
import Nav from "../components/Nav.jsx";
import Cards from "../components/Cards.jsx";
import About from "../components/About";
import Ciudad from "../components/Ciudad";

function App() {
  const [cities, setCities] = useState([]);

  // ONCLOSE: FUNCION QUE ES EJECUTADA POR EL BOTON "CERRAR" EN UNA CARD
  function onClose(id) {
    setCities((oldCities) => oldCities.filter((c) => c.id !== id));
  }

  // ONSEARCH: HACE LA PETICION A LA API DEL CLIMA, PASANDO COMO PARAMETRO EL VALOR DEL INPUT INGRESADO POR EL USUARIO (NOMBRE DE LA CIUDAD),
  // BUSCA LA CIUDAD Y ACTUALIZA EL ESTADO, AGREGANDO LA CIUDAD RECIBIDA CON LOS VALORES CORRESPONDIENTES.
  function onSearch(ciudad) {
    //Llamado a la API del clima
    fetch(
      `http://api.openweathermap.org/data/2.5/weather?q=${ciudad}&appid="4ae2636d8dfbdc3044bede63951a019b"`
    )
      .then((r) => r.json())
      .then((recurso) => {
        if (recurso.main !== undefined) {
          const city = {
            min: Math.round(recurso.main.temp_min),
            max: Math.round(recurso.main.temp_max),
            img: recurso.weather[0].icon,
            id: recurso.id,
            wind: recurso.wind.speed,
            temp: recurso.main.temp,
            name: recurso.name,
            weather: recurso.weather[0].main,
            clouds: recurso.clouds.all,
            latitud: recurso.coord.lat,
            longitud: recurso.coord.lon,
          };

          setCities((oldCities) => [...oldCities, city]);
        } else {
          alert("Ciudad no encontrada");
        }
      });
  }

  //  ONFILTER: FILTRA ELEMENTOS DEL ESTADO QUE COINCIDAN CON EL ID PASADO COMO PARAMETRO
  function onFilter(ciudadId) {
    let ciudad = cities.filter((c) => c.id === parseInt(ciudadId));
    if (ciudad.length > 0) {
      return ciudad[0];
    } else {
      return null;
    }
  }

  return (
    <div className="App">
      <Nav onSearch={onSearch} />
      <Routes>
        <Route path="/about" element={<About />} />
        <Route
          path="/ciudad/:id"
          exact
          element={<Ciudad city={onFilter()} />}
        />
        <Route path="/" element={<Cards cities={cities} onClose={onClose} />} />
      </Routes>
      <hr />
    </div>
  );
}

export default App;
