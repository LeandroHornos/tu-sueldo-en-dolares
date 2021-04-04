import React, { useEffect, useState } from "react";

import { useHistory } from "react-router-dom";

const Query = (props) => {
  const history = useHistory();
  //State
  const [oldSalaryAmmount, setOldSalaryAmmount] = useState(0);
  const [newSalaryAmmount, setNewSalaryAmmount] = useState(0);
  const [oldSalaryDate, setOldSalaryDate] = useState("");
  const [newSalaryDate, setNewSalaryDate] = useState("");

  const formatDate = (date) => {
    let ymd = date.split("-");
    return {
      day: parseInt(ymd[2]),
      month: parseInt(ymd[1]),
      year: parseInt(ymd[0]),
    };
  };
  const handleSubmit = () => {
    //
    const query = {
      oldSalaryAmmount: parseFloat(oldSalaryAmmount),
      newSalaryAmmount: parseFloat(newSalaryAmmount),
      oldSalaryDate: formatDate(oldSalaryDate),
      newSalaryDate: formatDate(newSalaryDate),
      date: new Date(),
    };

    console.log(query);
    props.setQuery(query);
    history.push("/results");
  };

  return (
    <React.Fragment>
      <div className="row">
        <div className="col-md-3"></div>
        <div className="col-md-6">
          <div className="cont">
            <h1 className="txt-color-1">Tu sueldo en dolares</h1>
            <p>
              Compara como varió tu salario en dólares a lo largo del tiempo
              utilizando esta aplicación. Completa el monto de tu salario en
              pesos en dos fechas distintas y dale al botón "calcular" para ver
              cómo ha variado tu salario en dólares entre las fechas indicadas
            </p>
            <form>
              <div className="mb-3">
                <label htmlFor="old-date" className="form-label">
                  Fecha
                </label>
                <input
                  type="date"
                  className="form-control"
                  aria-describedby="dateHelp"
                  id="old-date"
                  onChange={(e) => {
                    setOldSalaryDate(e.target.value);
                  }}
                />
              </div>

              <div className="mb-3">
                <label htmlFor="old-ammount" className="form-label">
                  Monto Anterior en Pesos:
                </label>
                <input
                  type="number"
                  className="form-control"
                  id="old-ammount"
                  value={oldSalaryAmmount}
                  onChange={(e) => {
                    setOldSalaryAmmount(parseFloat(e.target.value));
                  }}
                />
              </div>

              <div className="mb-3">
                <label htmlFor="new-date" className="form-label">
                  Fecha Final
                </label>
                <input
                  type="date"
                  className="form-control"
                  aria-describedby="dateHelp"
                  id="new-date"
                  onChange={(e) => {
                    setNewSalaryDate(e.target.value);
                  }}
                />
              </div>

              <div className="mb-3">
                <label htmlFor="new-ammount" className="form-label">
                  Nuevo monto en pesos:
                </label>
                <input
                  type="number"
                  className="form-control"
                  id="new-ammount"
                  value={parseFloat(newSalaryAmmount)}
                  onChange={(e) => {
                    setNewSalaryAmmount(e.target.value);
                  }}
                />
              </div>

              <button
                type="submit"
                className="btn btn-primary"
                onClick={(e) => {
                  e.preventDefault();
                  handleSubmit();
                }}
              >
                Calcular
              </button>
            </form>
          </div>
        </div>
        <div className="col-md-3"></div>
      </div>
    </React.Fragment>
  );
};

export default Query;
