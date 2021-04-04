import React, { useEffect, useState } from "react";

import dolarblue from "../dolarblue.json";
import dolaroficial from "../dolaroficial.json";

const Results = (props) => {
  const [currentQuery, setCurrentQuery] = useState(props.query);
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setCurrentQuery(props.query);
    if (currentQuery) {
      calculateResults(currentQuery);
    }
  }, [props]);

  const blue = dolarblue.map((doc) => {
    const dma = doc.fecha.split("-");
    return {
      day: parseInt(dma[0]),
      month: parseInt(dma[1]),
      year: parseInt(dma[2]),
      date: doc.fecha,
      compra: parseFloat(doc.compra),
      venta: parseFloat(doc.venta),
    };
  });

  const oficial = dolaroficial.map((doc) => {
    const dma = doc.fecha.split("-");
    return {
      day: parseInt(dma[0]),
      month: parseInt(dma[1]),
      year: parseInt(dma[2]),
      date: doc.fecha,
      compra: parseFloat(doc.compra),
      venta: parseFloat(doc.venta),
    };
  });

  const averageValueOf = (array) => {
    let onlyValues = array.map((item) => {
      return item.venta;
    });
    let sum = onlyValues.reduce((a, b) => a + b);
    return sum / array.length;
  };

  const calculateResults = (query) => {
    /* ------------- DOLAR BLUE ------------------------------- */

    const dolarBlueValuesOld = blue.filter((value) => {
      return (
        value.year === query.oldSalaryDate.year &&
        value.month === query.oldSalaryDate.month
      );
    });

    const dolarBlueValuesNew = blue.filter((value) => {
      return (
        value.year === query.newSalaryDate.year &&
        value.month === query.newSalaryDate.month
      );
    });
    console.log(
      "valores del dolar cercanos al viejo salario: ",
      dolarBlueValuesOld
    );
    console.log(
      "valores del dolar cercanos al nuevo salario: ",
      dolarBlueValuesNew
    );
    const dolarBlueOldAvg = averageValueOf(dolarBlueValuesOld);
    const dolarBlueNewAvg = averageValueOf(dolarBlueValuesNew);
    /* ------------- DOLAR OFICIAL ------------------------------- */
    // Viejo salario
    const dolarOficialValuesOld = oficial.filter((value) => {
      return (
        value.year === query.oldSalaryDate.year &&
        value.month === query.oldSalaryDate.month
      );
    });
    // Nuevl salario
    const dolarOficialValuesNew = oficial.filter((value) => {
      return (
        value.year === query.newSalaryDate.year &&
        value.month === query.newSalaryDate.month
      );
    });
    const dolarOficialOldAvg = averageValueOf(dolarOficialValuesOld);
    const dolarOficialNewAvg = averageValueOf(dolarOficialValuesNew);
    console.log("Dolar blue values:", dolarBlueValuesOld, dolarBlueValuesNew);
    console.log(
      "Dolar oficial values:",
      dolarOficialValuesOld,
      dolarOficialValuesNew
    );
    let calculatedResults = {
      oldBlueAvg: dolarBlueOldAvg,
      oldOficialAvg: dolarOficialOldAvg,
      newBlueAvg: dolarBlueNewAvg,
      newOfficialAvg: dolarOficialNewAvg,
      oldAmmountBlue: query.oldSalaryAmmount / dolarBlueOldAvg,
      oldAmmountOficial: query.oldSalaryAmmount / dolarOficialOldAvg,
      newAmmountBlue: query.newSalaryAmmount / dolarBlueNewAvg,
      newAmmountOficial: query.newSalaryAmmount / dolarOficialNewAvg,
    };
    setResults(calculatedResults);
    console.log("results", calculatedResults);
    setLoading(false);
  };

  return (
    <div className="row">
      <div className="col-md-3"></div>
      <div className="col-md-6">
        {!loading && <ResultsViewer query={currentQuery} results={results} />}
      </div>
      <div className="col-md-3"></div>
    </div>
  );
};

const ResultsViewer = (props) => {
  return (
    <div className="row">
      <div className="col-md-6">
        <div>
          <ul>
            <li>Vieja cotización dolar blue: {props.results.oldBlueAvg}</li>
            <li>
              Vieja cotización dolar oficial: {props.results.oldOficialAvg}
            </li>
            <li>Viejo monto en pesos: {props.query.oldSalaryAmmount}</li>
            <li>Viejo monto en dolar blue: {props.results.oldAmmountBlue}</li>
            <li>
              Viejo monto en dolar oficial: {props.results.oldAmmountOficial}{" "}
            </li>
            <li>Nueva cotización dolar blue: {props.results.newBlueAvg}</li>
            <li>Nueva cotización dolar blue: {props.results.newOficialAvg} </li>
            <li>Nuevo monto en pesos: {props.query.newSalaryAmmount}</li>
            <li>Nuevo monto en dolar blue: {props.results.newAmmountBlue}</li>
            <li>
              Nuevo monto en dolar oficial: {props.results.newAmmountOficial}
            </li>
          </ul>
        </div>
        <table className="table">
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">Old</th>
              <th scope="col">New</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th scope="row">Cotizacion Blue</th>
              <td>{props.results.oldBlueAvg}</td>
              <td>{props.results.newBlueAvg}</td>
            </tr>
            <tr>
              <th scope="row">Monto Pesos</th>
              <td>{props.query.oldSalaryAmmount}</td>
              <td>{props.results.newAmmountBlue}</td>
            </tr>
            <tr>
              <th scope="row">Monto blue</th>
              <td>{props.results.oldAmmountBlue}</td>
              <td>{props.results.newAmmountBlue}</td>
            </tr>
            <tr>
              <th scope="row">Monto Oficial</th>
              <td>{props.results.oldAmmountOficial}</td>
              <td>{props.results.newAmmountOficial}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className="col-md-3"></div>
    </div>
  );
};

export default Results;
