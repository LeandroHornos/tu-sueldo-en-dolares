import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

import React, { useState, useEffect } from "react";

import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import NuevaCotizacion from "./Components/NuevaCotizacion";
import Cotizaciones from "./Components/Cotizaciones";
import About from "./Components/About";
import Query from "./Components/Query";
import Results from "./Components/Results";

function App() {
  const [query, setQuery] = useState(null);

  useEffect(() => {
    console.log("New Query:", query);
  }, [query]);

  return (
    <Router>
      <Switch>
        <Route exact path="/">
          <Query setQuery={setQuery} />
        </Route>
        <Route exact path="/results">
          <Results query={query} />
        </Route>
        <Route exact path="/about">
          <About />
        </Route>
        <Route exact path="/controlpanel/nuevacotizacion">
          <NuevaCotizacion />
        </Route>
        <Route exact path="/controlpanel/cotizaciones">
          <Cotizaciones />
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
