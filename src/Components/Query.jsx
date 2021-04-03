import React, { useEffect, useState } from "react";

import { useHistory } from "react-router-dom";

import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

const Query = (props) => {
  const history = useHistory();
  //State
  const [oldSalaryAmmount, setOldSalaryAmmount] = useState(null);
  const [newSalaryAmmount, setNewSalaryAmmount] = useState(null);
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
      oldSalaryAmmount,
      newSalaryAmmount,
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
            <Form>
              <hr style={{ margin: "80px 0px" }} />
              <h2 className="txt-color-1">Fecha inicial</h2>
              <p>Ingresa tu sueldo en pesos en algún momento del pasado</p>
              <Form.Group controlId="formOldSalary">
                <Form.Label>Tu sueldo en pesos</Form.Label>
                <Form.Control
                  type="number"
                  onChange={(e) => {
                    setOldSalaryAmmount(e.target.value);
                  }}
                />
              </Form.Group>

              <Form.Group controlId="formOldDate">
                <Form.Label>Fecha</Form.Label>
                <Form.Text className="text-muted">
                  Ingresa la fecha a la que corresponde el monto ingresado
                </Form.Text>
                <Form.Control
                  type="date"
                  onChange={(e) => {
                    setOldSalaryDate(e.target.value);
                  }}
                />
              </Form.Group>
              <hr style={{ margin: "80px 0px" }} />
              <h2 className="txt-color-1">Fecha Final</h2>
              <p>
                Ingresa el monto de tu sueldo en pesos actual, o en la fecha que
                quieras comparar con la fecha inicial
              </p>
              <Form.Group controlId="formNewSalary">
                <Form.Label>Tu sueldo en pesos</Form.Label>
                <Form.Control
                  type="number"
                  onChange={(e) => {
                    setNewSalaryAmmount(e.target.value);
                  }}
                />
              </Form.Group>

              <Form.Group controlId="formNewDate">
                <Form.Label>Fecha</Form.Label>
                <Form.Text className="text-muted">
                  Ingresa la fecha a la que corresponde el monto ingresado
                </Form.Text>
                <Form.Control
                  type="date"
                  onChange={(e) => {
                    setNewSalaryDate(e.target.value);
                  }}
                />
              </Form.Group>
              <Button
                variant="primary"
                onClick={(e) => {
                  e.preventDefault();
                  handleSubmit();
                }}
              >
                Calcular
              </Button>
            </Form>
          </div>
        </div>
        <div className="col-md-3"></div>
      </div>
    </React.Fragment>
  );
};

export default Query;
