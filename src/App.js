import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

import React, { useState, useEffect } from "react";

import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import Admin from "./Components/Admin";
import Query from "./Components/Query";
import Results from "./Components/Results";

function App() {
  const [query, setQuery] = useState({});

  useEffect(() => {
    console.log("New Query:", query);
  }, [query]);

  return (
    <div className="App">
      <Router>
        <Switch>
          <Route exact path="/">
            <Query setQuery={setQuery} />
          </Route>
          <Route exact path="/results">
            <Results query={query} />
          </Route>
        </Switch>
      </Router>
    </div>
  );
}

export default App;
