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
    <div className="row">
      <div className="col-md-3"></div>
      <div className="col-md-6">
        {!loading && (
          <ResultsViewer
            query={currentQuery}
            results={results}
            chartData={chartData}
          />
        )}
      </div>
      <div className="col-md-3"></div>
    </div>
  );
};

const ResultsViewer = (props) => {
  const oldDate = props.query.oldDate;
  const newDate = props.query.newDate;
  const data = props.chartData;

  return (
    <React.Fragment>
      <div className="row">
        <div className="col-md-2"></div>
        <div className="col-md-8">
          <div className="cont">
            <h1>Resultados</h1>
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
                  <th scope="row">Fecha</th>
                  <td>{`${oldDate.year}-${oldDate.month}-${oldDate.day}`}</td>
                  <td>{`${newDate.year}-${newDate.month}-${newDate.day}`}</td>
                </tr>
                <tr>
                  <th scope="row">Cotizacion Blue</th>
                  <td>{props.results.oldBlueAvg.toFixed(2)}</td>
                  <td>{props.results.newBlueAvg.toFixed(2)}</td>
                </tr>
                <tr>
                  <th scope="row">Cotizacion Oficial</th>
                  <td>{props.results.oldOficialAvg.toFixed(2)}</td>
                  <td>{props.results.newOficialAvg.toFixed(2)}</td>
                </tr>
                <tr>
                  <th scope="row">Monto Pesos</th>
                  <td>{props.query.oldAmmount.toFixed(2)}</td>
                  <td>{props.query.newAmmount.toFixed(2)}</td>
                </tr>
                <tr>
                  <th scope="row">Monto blue</th>
                  <td>{props.results.oldAmmountBlue.toFixed(2)}</td>
                  <td>{props.results.newAmmountBlue.toFixed(2)}</td>
                </tr>
                <tr>
                  <th scope="row">Monto Oficial</th>
                  <td>{props.results.oldAmmountOficial.toFixed(2)}</td>
                  <td>{props.results.newAmmountOficial.toFixed(2)}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div className="col-md-8"></div>
      </div>
      <div className="row">
        <div className="col-md-3"></div>
        <div className="col-md-6">
          <div className="cont d-flex flex-column align-items-center justify-content-center">
            <h2 className="text-center">¿Cuanto varió en dolares?</h2>
            <LineChart
              width={500}
              height={300}
              data={data}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
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
                stroke="#8884d8"
                activeDot={{ r: 8 }}
              />
              <Line type="monotone" dataKey="oficial" stroke="#82ca9d" />
            </LineChart>
          </div>
        </div>
        <div className="col-md-3"></div>
      </div>
    </React.Fragment>
  );
};

export default Results;
