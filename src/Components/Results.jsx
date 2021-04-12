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
import uvaValues from "../uva.json";

const inUvaEra = (dmyDate) => {
  /* El valor UVA implementó a partir de marzo de 2016. Esta
  función chequea que la fecha indicada sea posterior a la 
  existencia del valor UVA. */
  return dmyDate.year > 2016 || (dmyDate.year === 2016 && dmyDate.month > 4);
};

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

  const uva = uvaValues.map((doc) => {
    const dma = doc.fecha.split("/");
    return {
      day: parseInt(dma[0]),
      month: parseInt(dma[1]),
      year: parseInt(dma[2]),
      date: doc.fecha,
      value: parseFloat(doc.uva),
    };
  });

  const averageValueOf = (array, key) => {
    /* Calcula el promedio de un valor que se encuentra
    en un array de objetos */

    let onlyValues = array.map((item) => {
      return item[key];
    });
    let sum = onlyValues.reduce((a, b) => a + b);
    if (array.length === 0) {
      return null;
    } else {
      return sum / array.length;
    }
  };

  const filterMonthBefore = (dma, entry) => {
    /* Devuelve true si la fecha asociada al valor indicado se encuentra dentro
    de los 3 dias de la fecha indicada. Sirve para usar como condicion en array.filter
    para filtrar aquellos valores correspondientes al mes anterior a la fecha ingresada */

    const { day, month, year } = dma;
    if (month === 1) {
      // Si la fecha es en los primeros 15 dias de enero, traer los valores del diciembre anterior y los de enero.
      return (
        (entry.year === year - 1 && entry.month === 12 && entry.day >= day) ||
        (entry.year === year && entry.month === 1 && entry.day <= day)
      );
    } else {
      // Para los demas meses devuelvo las entradas de los 30 dias anteriores.
      return (
        (entry.year === year && entry.month === month - 1 && entry.day > day) ||
        (entry.year === year && entry.month === month && entry.day <= day)
      );
    }
  };

  const calculateResults = (query) => {
    /* Primero busca entre las cotizaciones los valores del mes
   anterior a las fechas introducidas, tanto para el blue como para el
   oficial. Luego calcula un valor promedio para cada rango. Finalmente,
   usa esa cotizacion promedio para pasar a dólares los montos en pesos
   ingresados */

    // Cotizaciones cercanas a las fechas indicadas:
    const dolarBlueValuesOld = blue.filter((entry) => {
      return filterMonthBefore(query.oldDate, entry);
    });

    const dolarBlueValuesNew = blue.filter((entry) => {
      return filterMonthBefore(query.newDate, entry);
    });

    const dolarOficialValuesOld = oficial.filter((entry) => {
      return filterMonthBefore(query.oldDate, entry);
    });
    const dolarOficialValuesNew = oficial.filter((entry) => {
      return filterMonthBefore(query.newDate, entry);
    });

    const uvaOld = uva.filter((entry) => {
      return filterMonthBefore(query.oldDate, entry);
    });
    const uvaNew = uva.filter((entry) => {
      return filterMonthBefore(query.newDate, entry);
    });

    // Valores promedio de las cotizaciones:
    const dolarBlueOldAvg = averageValueOf(dolarBlueValuesOld, "venta");
    const dolarBlueNewAvg = averageValueOf(dolarBlueValuesNew, "venta");
    const dolarOficialOldAvg = averageValueOf(dolarOficialValuesOld, "venta");
    const dolarOficialNewAvg = averageValueOf(dolarOficialValuesNew, "venta");
    const uvaOldAvg = inUvaEra(query.oldDate)
      ? averageValueOf(uvaOld, "value")
      : null;
    const uvaNewAvg = inUvaEra(query.newDate)
      ? averageValueOf(uvaNew, "value")
      : null;
    // console.log("vieja fecha", query.oldDate);
    // console.log("nueva fecha", query.newDate);
    // console.log("vieja fecha en era uva?", inUvaEra(query.oldDate));
    // console.log("nueva fecha en era uva?", inUvaEra(query.newDate));
    // console.log("uvaOldAvg:", uvaOldAvg);
    // console.log("uvaNewAvg:", uvaNewAvg);

    // Junto los resultados para devolverlos:

    const calculatedResults = {
      oldBlueAvg: parseFloat(dolarBlueOldAvg),
      oldOficialAvg: parseFloat(dolarOficialOldAvg),
      uvaOldAvg: uvaOldAvg ? parseFloat(uvaOldAvg) : uvaOldAvg,
      newBlueAvg: parseFloat(dolarBlueNewAvg),
      newOficialAvg: parseFloat(dolarOficialNewAvg),
      uvaNewAvg: uvaNewAvg ? parseFloat(uvaNewAvg) : uvaNewAvg,
      oldAmmountBlue: parseFloat(query.oldAmmount / dolarBlueOldAvg),
      oldAmmountOficial: parseFloat(query.oldAmmount / dolarOficialOldAvg),
      oldAmmountUva: uvaOldAvg
        ? parseFloat(query.oldAmmount / uvaOldAvg)
        : uvaOldAvg,
      newAmmountBlue: parseFloat(query.newAmmount / dolarBlueNewAvg),
      newAmmountOficial: parseFloat(query.newAmmount / dolarOficialNewAvg),
      newAmmountUva: uvaNewAvg
        ? parseFloat(query.newAmmount / uvaNewAvg)
        : uvaNewAvg,
    };

    const dataForCharts = [
      {
        name: "Old",
        date: query.oldDate,
        pesos: query.oldAmmount,
        oficial: calculatedResults.oldAmmountOficial,
        blue: calculatedResults.oldAmmountBlue,
        uva: calculatedResults.oldAmmountUva,
      },
      {
        name: "New",
        date: query.newDate,
        pesos: query.newAmmount,
        oficial: calculatedResults.newAmmountOficial,
        blue: calculatedResults.newAmmountBlue,
        uva: calculatedResults.newAmmountUva,
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
          inUvaEra={
            inUvaEra(currentQuery.oldDate) && inUvaEra(currentQuery.newDate)
          }
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

            <div style={{ padding: "30px 10px" }}>
              <DolarLineChart data={data} />

              <div
                className="d-flex flex-column align-items-center justify-content-center"
                style={{ padding: "40px 20px" }}
              >
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
              <h2 className="text-center txt-color-1">
                ¿Cuanto varió en UVAs?
              </h2>
              <UvaLineChart data={data} inUvaEra={props.inUvaEra} />
            </div>
          </div>
        </div>
        <div className="col-md-2"></div>
      </div>
    </React.Fragment>
  );
};

const DolarLineChart = (props) => {
  return (
    <LineChart
      width={
        window.innerWidth > 600
          ? 0.5 * window.innerWidth
          : 0.8 * window.innerWidth
      }
      height={300}
      data={props.data}
    >
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="name" />
      <YAxis label={{ value: "USD", angle: -90, position: "insideLeft" }} />
      <Tooltip />
      <Legend />
      <Line type="monotone" dataKey="blue" stroke="blue" activeDot={{ r: 8 }} />
      <Line type="monotone" dataKey="oficial" stroke="green" />
    </LineChart>
  );
};

const UvaLineChart = (props) => {
  if (!props.inUvaEra) {
    return (
      <p className="text-center">
        Uno o mas valores son anteriores a la era UVA
      </p>
    );
  } else {
    return (
      <LineChart
        width={
          window.innerWidth > 600
            ? 0.5 * window.innerWidth
            : 0.8 * window.innerWidth
        }
        height={300}
        data={props.data}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis label={{ value: "UVA", angle: -90, position: "insideLeft" }} />
        <Tooltip />
        <Legend />
        <Line
          type="monotone"
          dataKey="uva"
          stroke="blue"
          activeDot={{ r: 8 }}
        />
      </LineChart>
    );
  }
};

export default Results;
