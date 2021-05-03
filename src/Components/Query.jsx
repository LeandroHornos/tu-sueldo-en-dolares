import React, { useEffect, useState } from "react";

import { useHistory } from "react-router-dom";

import AlertMessages from "./AlertMessages";
import NavigationBar from "./NavigationBar";

export const dateToTimestamp = (date) => {
  let myDate = new Date(date);
  myDate = myDate.getTime();
  return myDate;
};

export const formatDate = (date) => {
  // Separa la fecha en dia, mes, año para facilitar el filtrado
  let ymd = date.split("-");
  return {
    day: parseInt(ymd[2]),
    month: parseInt(ymd[1]),
    year: parseInt(ymd[0]),
  };
};

const Query = (props) => {
  const history = useHistory();
  //State
  const [oldAmmount, setOldAmmount] = useState("");
  const [newAmmount, setNewAmmount] = useState("");
  const [oldDate, setOldDate] = useState("");
  const [newDate, setNewDate] = useState("");
  const [msgs, setMsgs] = useState([]);

  const validateForm = () => {
    let isValid = true;
    let errors = [];
    // Si se ingresaron fechas, las formateo a dia, mes año:
    const od = oldDate === "" ? oldDate : formatDate(oldDate);
    const nd = newDate === "" ? newDate : formatDate(newDate);
    // Error: hay campos sin completar:
    if (oldAmmount === "" || newAmmount === "" || od === "" || nd === "") {
      errors.push({ type: "error", text: "Debes completar todos los campos" });
      isValid = false;
    }
    // Error: alguna fecha es anterior a febrero 2012
    if (
      (od !== "" && od.year < 2012) ||
      (nd !== "" && nd.year < 2012) ||
      (od !== "" && od.year === 2012 && od.month < 2) ||
      (nd !== "" && nd.year === 2012 && nd.month < 2)
    ) {
      errors.push({
        type: "error",
        text: "Las fechas deben ser posteriores a enero de 2012",
      });
      isValid = false;
    }
    // Error: la segunda fecha es anterior a la primera
    if (od !== "" && nd !== "") {
      if (
        nd.year < od.year ||
        (nd.year === od.year && nd.month < od.month) ||
        (nd.year === od.year && nd.month === od.month && nd.day < od.day)
      ) {
        errors.push({
          type: "error",
          text: "La segunda fecha debe ser posterior a la primera",
        });
        isValid = false;
      }
    }
    return { isValid, errors };
  };

  const handleSubmit = () => {
    const { isValid, errors } = validateForm();

    if (isValid) {
      const query = {
        oldAmmount: parseFloat(oldAmmount),
        newAmmount: parseFloat(newAmmount),
        oldDate: dateToTimestamp(oldDate),
        newDate: dateToTimestamp(newDate),
        date: new Date(),
      };
      // console.log(query);
      props.setQuery(query);
      console.log(query);
      history.push("/results");
    } else {
      setMsgs([...errors]);
    }
  };

  return (
    <React.Fragment>
      <NavigationBar />
      <div className="row">
        <div className="col-md-3"></div>
        <div className="col-md-6">
          <div className="cont">
            <h1 className="txt-color-1 text-center">
              ¿ Cómo varió en dólares ?
            </h1>
            <p>
              Compará como varió a lo largo del tiempo tu salario, tu alquiler,
              la cuota del préstamo o cualquier otro monto en pesos argentinos
              en su equivalente en dólares utilizando esta aplicación. Completá
              los montos en pesos correspondientes a dos fechas distintas y dale
              al botón "calcular" para ver los resultados.
            </p>
            <form>
              <div className="mb-3">
                <label htmlFor="old-date" className="form-label">
                  Fecha inicial:
                </label>
                <p className="form-text">
                  La fecha inicial debe ser posterior a junio de 2012
                </p>
                <input
                  type="date"
                  className="form-control"
                  aria-describedby="dateHelp"
                  id="old-date"
                  onChange={(e) => {
                    setOldDate(e.target.value);
                  }}
                />
              </div>

              <div className="mb-3">
                <label htmlFor="old-ammount" className="form-label">
                  Monto anterior en pesos argentinos:
                </label>
                <input
                  type="number"
                  className="form-control"
                  id="old-ammount"
                  value={oldAmmount}
                  onChange={(e) => {
                    setOldAmmount(e.target.value);
                  }}
                />
              </div>

              <div className="mb-3">
                <label htmlFor="new-date" className="form-label">
                  Fecha final:
                </label>
                <p className="form-text">
                  La fecha final debe ser posterior a la inicial y anterior o
                  igual a la fecha de hoy.
                </p>
                <input
                  type="date"
                  className="form-control"
                  aria-describedby="dateHelp"
                  id="new-date"
                  onChange={(e) => {
                    setNewDate(e.target.value);
                  }}
                />
              </div>

              <div className="mb-3">
                <label htmlFor="new-ammount" className="form-label">
                  Nuevo monto en pesos argentinos:
                </label>
                <input
                  type="number"
                  className="form-control"
                  id="new-ammount"
                  value={newAmmount}
                  onChange={(e) => {
                    setNewAmmount(e.target.value);
                  }}
                />
              </div>
              <AlertMessages messages={msgs} />
              <button
                type="submit"
                className="btn btn-success btn-block"
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
