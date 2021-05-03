import React, { useState } from "react";

//Firebase
import firebaseApp from "../firebaseApp";

// React Bootstrap
import Table from "react-bootstrap/Table";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

// Components
import AdminNavbar from "./AdminNavbar";

import { dateToTimestamp } from "./Query";

const Cotizaciones = () => {
  const db = firebaseApp.firestore();

  const [currency, setCurrency] = useState("blue");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [cotizaciones, setCotizaciones] = useState([]);
  const [loading, setLoading] = useState(true);

  const handleSubmit = async () => {
    const lowerDateLimit = dateToTimestamp(from);
    const upperDateLimit = dateToTimestamp(to);
    setLoading(true);
    try {
      let results = await db
        .collection(currency)
        .where("timestamp", ">=", lowerDateLimit)
        .where("timestamp", "<=", upperDateLimit)
        .get();

      results = results.docs.map((doc) => {
        return { ...doc.data(), id: doc.id };
      });
      setCotizaciones(results);
      setLoading(false);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <React.Fragment>
      <AdminNavbar />
      <div className="row">
        <div className="col-md-3"></div>
        <div className="col-md-6">
          <h1>Control Panel</h1>
          <h2>Cotizaciones</h2>
          <Form>
            <Form.Group>
              <Form.Label>Divisa</Form.Label>
              <Form.Control
                as="select"
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
              >
                <option value="blue">Dolar Blue</option>
                <option value="official">Dolar Oficial</option>
                <option value="uva">Uva</option>
              </Form.Control>
            </Form.Group>
            <Form.Group>
              <Form.Label>Desde:</Form.Label>
              <input
                type="date"
                className="form-control"
                aria-describedby="dateHelp"
                id="from"
                onChange={(e) => {
                  setFrom(e.target.value);
                }}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Hasta:</Form.Label>
              <input
                type="date"
                className="form-control"
                aria-describedby="dateHelp"
                id="to"
                onChange={(e) => {
                  setTo(e.target.value);
                }}
              />
            </Form.Group>
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
        </div>
        <div className="col-md-3"></div>
      </div>
      <div className="row">
        <div className="col-md-3"></div>
        <div className="col-md-6">
          {!loading && (
            <React.Fragment>
              <h3 className="text-center">{currency}</h3>
              <TablaCotizaciones currency={currency} data={cotizaciones} />
            </React.Fragment>
          )}
        </div>
        <div className="col-md-3"></div>
      </div>
    </React.Fragment>
  );
};

export const TablaCotizaciones = (props) => {
  const { currency, data } = props;
  return currency === "uva" ? (
    <TablaUva data={data} />
  ) : (
    <TablaDolar data={data} />
  );
};

export const TablaDolar = (props) => {
  const { data } = props;
  return (
    <Table>
      <thead>
        <tr>
          <th>Fecha</th>
          <th>Compra</th>
          <th>Venta</th>
        </tr>
      </thead>
      <tbody>
        {data.map((el) => {
          return (
            <tr key={el.id}>
              <td>{`${el.day}-${el.month}-${el.year}`}</td>
              <td>{el.compra}</td>
              <td>{el.venta}</td>
            </tr>
          );
        })}
      </tbody>
    </Table>
  );
};

export const TablaUva = (props) => {
  const { data } = props;
  return (
    <Table>
      <thead>
        <tr>
          <th>Fecha</th>
          <th>Valor UVA</th>
        </tr>
      </thead>
      <tbody>
        {data.map((el) => {
          return (
            <tr key={el.id}>
              <td>{`${el.day}-${el.month}-${el.year}`}</td>
              <td>{el.valor}</td>
            </tr>
          );
        })}
      </tbody>
    </Table>
  );
};

export default Cotizaciones;
