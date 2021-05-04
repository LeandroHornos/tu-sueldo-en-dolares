import React, { useState } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import InputGroup from "react-bootstrap/InputGroup";

import { dateToTimestamp, formatDate } from "./Query";

import firebaseApp from "../firebaseApp";

import AdminNavbar from "./AdminNavbar";

const NuevaCotizacion = () => {
  return (
    <React.Fragment>
      <AdminNavbar />
      <div className="row">
        <div className="col-md-2 col-lg-3"></div>
        <div className="col-md-8 col-lg-6">
          <h1 className="text-center">Control Panel</h1>

          <h2>Nueva cotización</h2>
          <NewValueForm />
        </div>
        <div className="col-md-2 col-lg-3"></div>
      </div>
    </React.Fragment>
  );
};

export const NewValueForm = () => {
  const [currency, setCurrency] = useState("blue");
  const [date, setDate] = useState("");
  const [buyValue, setBuyValue] = useState("");
  const [sellValue, setSellValue] = useState("");
  const [uvaValue, setUvaValue] = useState("");

  const db = firebaseApp.firestore();

  const clearForm = () => {
    setBuyValue("");
    setSellValue("");
    setUvaValue("");
  };

  const handleSubmit = async () => {
    const { day, month, year } = formatDate(date);
    let data = {
      day,
      month,
      year,
      timestamp: dateToTimestamp(date),
    };
    switch (currency) {
      case "blue":
        data = {
          ...data,
          compra: parseFloat(buyValue),
          venta: parseFloat(sellValue),
        };
        break;
      case "official":
        data = {
          ...data,
          compra: parseFloat(buyValue),
          venta: parseFloat(sellValue),
        };
        break;
      case "uva":
        data = {
          ...data,
          valor: parseFloat(uvaValue),
        };
        break;
      default:
        console.log("algo no ha salido bien");
        break;
    }
    console.log("data para guardar:", data);
    try {
      // Primero checkeo si ese valor ya existe.
      let results = await db
        .collection(currency)
        .where("year", "==", year)
        .where("month", "==", month)
        .where("day", "==", day)
        .get();
      const documentExists = results.docs.length > 0;
      if (!documentExists) {
        await db.collection(currency).add(data);
        console.log("Se ha creado el documento");
        clearForm();
      } else {
        console.log("Ya existe una cotización para esa fecha");
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Form>
      <Form.Group>
        <Form.Label>Cotización</Form.Label>
        <Form.Control
          as="select"
          value={currency}
          onChange={(e) => {
            setCurrency(e.target.value);
          }}
        >
          <option value="blue">Dolar Blue</option>
          <option value="official">Dolar Oficial</option>
          <option value="uva">Uva</option>
        </Form.Control>
      </Form.Group>
      <Form.Group>
        <Form.Label>Fecha</Form.Label>
        <input
          type="date"
          className="form-control"
          aria-describedby="dateHelp"
          id="new-date"
          onChange={(e) => {
            setDate(e.target.value);
          }}
        />
      </Form.Group>
      {currency === "uva" ? (
        <Form.Group>
          <Form.Label>Valor Uva</Form.Label>
          <Form.Control
            type="number"
            value={uvaValue}
            onChange={(e) => {
              setUvaValue(e.target.value);
            }}
          ></Form.Control>
        </Form.Group>
      ) : (
        <React.Fragment>
          <Form.Group>
            <Form.Label>Compra</Form.Label>
            <Form.Control
              type="number"
              value={buyValue}
              onChange={(e) => {
                setBuyValue(e.target.value);
              }}
            ></Form.Control>
          </Form.Group>
          <Form.Group>
            <Form.Label>Venta</Form.Label>
            {/* <Form.Control
              type="number"
              value={sellValue}
              onChange={(e) => {
                setSellValue(e.target.value);
              }}
            ></Form.Control> */}

            <InputGroup className="mb-3">
              <Form.Control
                type="number"
                value={sellValue}
                onChange={(e) => {
                  setSellValue(e.target.value);
                }}
                aria-label="Amount (to the nearest dollar)"
              />
              <InputGroup.Append>
                <InputGroup.Text>$</InputGroup.Text>
              </InputGroup.Append>
            </InputGroup>
          </Form.Group>
        </React.Fragment>
      )}
      <Button
        block
        onClick={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
      >
        Enviar
      </Button>
    </Form>
  );
};

export default NuevaCotizacion;
