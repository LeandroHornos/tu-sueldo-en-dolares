import React, { useEffect, useState } from "react";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

import dolarblue from "../dolarblue.json";
import dolaroficial from "../dolaroficial.json";

const Results = (props) => {
  const [currentQuery, setCurrentQuery] = useState(props.query);
  const [results, setResults] = useState({});
  const [chartData, setChartData] = useState([]);
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

  const filterMonthBefore = (dma, value) => {
    const { day, month, year } = dma;
    if (month === 1) {
      // Si la fecha es en los primeros 15 dias de enero, traer los valores del diciembre anterior y los de enero.
      return (
        (value.year === year - 1 && value.month === 12 && value.day >= day) ||
        (value.year === year && value.month === 1 && value.day <= day)
      );
    } else {
      // Para los demas meses devuelvo las entradas de los 30 dias anteriores.
      return (
        (value.year === year && value.month === month - 1 && value.day > day) ||
        (value.year === year && value.month === month && value.day <= day)
      );
    }
  };

  const calculateResults = (query) => {
    /* Primero busca entre las cotizaciones los valores del mes
   anterior a las fechas introducidas, tanto para el blue como para el
   oficial. Luego calcula un valor promedio para cada rango. Finalmente,
   usa esa cotizacion promedio para pasar a dólares los montos en pesos
   ingresados */

    const dolarBlueValuesOld = blue.filter((value) => {
      return filterMonthBefore(query.oldDate, value);
    });

    const dolarBlueValuesNew = blue.filter((value) => {
      return filterMonthBefore(query.newDate, value);
    });

    const dolarOficialValuesOld = oficial.filter((value) => {
      return filterMonthBefore(query.oldDate, value);
    });
    const dolarOficialValuesNew = oficial.filter((value) => {
      return filterMonthBefore(query.newDate, value);
    });

    const dolarBlueOldAvg = averageValueOf(dolarBlueValuesOld);
    const dolarBlueNewAvg = averageValueOf(dolarBlueValuesNew);
    const dolarOficialOldAvg = averageValueOf(dolarOficialValuesOld);
    const dolarOficialNewAvg = averageValueOf(dolarOficialValuesNew);

    // Junto los resultados para devolverlos:
    const calculatedResults = {
      oldBlueAvg: parseFloat(dolarBlueOldAvg),
      oldOficialAvg: parseFloat(dolarOficialOldAvg),
      newBlueAvg: parseFloat(dolarBlueNewAvg),
      newOficialAvg: parseFloat(dolarOficialNewAvg),
      oldAmmountBlue: parseFloat(query.oldAmmount / dolarBlueOldAvg),
      oldAmmountOficial: parseFloat(query.oldAmmount / dolarOficialOldAvg),
      newAmmountBlue: parseFloat(query.newAmmount / dolarBlueNewAvg),
      newAmmountOficial: parseFloat(query.newAmmount / dolarOficialNewAvg),
    };

    const dataForCharts = [
      {
        name: "Old",
        date: query.oldDate,
        pesos: query.oldAmmount,
        oficial: calculatedResults.oldAmmountOficial,
        blue: calculatedResults.oldAmmountBlue,
      },
      {
        name: "New",
        date: query.newDate,
        pesos: query.newAmmount,
        oficial: calculatedResults.newAmmountOficial,
        blue: calculatedResults.newAmmountBlue,
      },
    ];
    setResults(calculatedResults);
    console.log("data for charts:", dataForCharts);
    setChartData(dataForCharts);
    setLoading(false);
  };

  return (
    <div>
      {!loading && (
        <ResultsViewer
          query={currentQuery}
          results={results}
          chartData={chartData}
        />
      )}
    </div>
  );
};

const ResultsViewer = (props) => {
  const oldDate = props.query.oldDate;
  const newDate = props.query.newDate;
  const data = props.chartData;

  const {
    oldBlueAvg,
    newBlueAvg,
    oldOficialAvg,
    newOficialAvg,
    oldAmmountBlue,
    newAmmountBlue,
    oldAmmountOficial,
    newAmmountOficial,
  } = props.results;

  const { oldAmmount, newAmmount } = props.query;

  return (
    <React.Fragment>
      <div className="row">
        <div className="col-md-2"></div>
        <div className="col-md-8">
          <div className="cont">
            <h1 className="text-center txt-color-1">Resultados</h1>
            <table className="table">
              <thead>
                <tr>
                  <th scope="col"></th>
                  <th scope="col">Anterior</th>
                  <th scope="col">Nuevo</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <th scope="row">Fecha</th>
                  <td>{`${oldDate.day}-${oldDate.month}-${oldDate.year}`}</td>
                  <td>{`${newDate.day}-${newDate.month}-${newDate.year}`}</td>
                </tr>
                <tr>
                  <th scope="row">Cotización dolar blue</th>
                  <td>{oldBlueAvg.toFixed(2)}</td>
                  <td>{newBlueAvg.toFixed(2)}</td>
                </tr>
                <tr>
                  <th scope="row">Cotización dolar oficial</th>
                  <td>{oldOficialAvg.toFixed(2)}</td>
                  <td>{newOficialAvg.toFixed(2)}</td>
                </tr>
                <tr>
                  <th scope="row">Monto en pesos</th>
                  <td>{oldAmmount.toFixed(2)}</td>
                  <td>{newAmmount.toFixed(2)}</td>
                </tr>
                <tr>
                  <th scope="row">Monto en dolar blue</th>
                  <td>{oldAmmountBlue.toFixed(2)}</td>
                  <td>{newAmmountBlue.toFixed(2)}</td>
                </tr>
                <tr>
                  <th scope="row">Monto en dolar oficial</th>
                  <td>{oldAmmountOficial.toFixed(2)}</td>
                  <td>{newAmmountOficial.toFixed(2)}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div className="col-md-2"></div>
      </div>
      <div className="row">
        <div className="col-md-2"></div>
        <div className="col-md-8">
          <div className="cont d-flex flex-column align-items-center justify-content-center">
            <h2 className="text-center txt-color-1">
              ¿Cuanto varió en dolares?
            </h2>
            <LineChart
              width={
                window.innerWidth > 600
                  ? 0.5 * window.innerWidth
                  : 0.8 * window.innerWidth
              }
              height={300}
              data={data}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis
                label={{ value: "USD", angle: -90, position: "insideLeft" }}
              />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="blue"
                stroke="blue"
                activeDot={{ r: 8 }}
              />
              <Line type="monotone" dataKey="oficial" stroke="green" />
            </LineChart>
            <div style={{ padding: "30px 10px" }}>
              <p>
                <span className="txt-color-1 font-weight-bold">
                  Variacion porcentual en dolar blue:
                </span>{" "}
                {parseFloat(
                  (newAmmountBlue * 100) / oldAmmountBlue - 100
                ).toFixed(2)}
                %
              </p>
              <p>
                <span className="txt-color-1 font-weight-bold">
                  Variacion porcentual en dolar ofical:
                </span>{" "}
                {parseFloat(
                  (newAmmountOficial * 100) / oldAmmountOficial - 100
                ).toFixed(2)}
                %
              </p>
            </div>
          </div>
        </div>
        <div className="col-md-2"></div>
      </div>
    </React.Fragment>
  );
};

export default Results;
