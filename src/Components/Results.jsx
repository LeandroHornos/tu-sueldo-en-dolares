import React, { useEffect, useState } from "react";

import firebaseApp from "../firebaseApp";

// Rechart:
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

// Components:
import NavigationBar from "./NavigationBar";

const inUvaEra = (timestamp) => {
  /* El valor UVA implementó a partir de marzo de 2016. Esta
  función chequea que la fecha indicada sea posterior a la 
  existencia del valor UVA. */
  const oldestDateWithData = 1459468800000; //  01/04/2016
  return timestamp > oldestDateWithData;
};

const Results = (props) => {
  // Firestore
  const db = firebaseApp.firestore();

  // State
  const [blueValues, setBlueValues] = useState({ old: [], new: [] });
  const [officialValues, setOfficialValues] = useState({ old: [], new: [] });
  const [uvaValues, setUvaValues] = useState({ old: [], new: [] });
  const [results, setResults] = useState({});
  const [chartData, setChartData] = useState([]);
  const [fetchedData, setFetchedData] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async (query) => {
      /* A partir de la query, busca en la base de datos las
      cotizaciones de los 15 días anteriores a las fechas indicadas
      para luego calcular los resultados */
      const fifteenDays = 15 * 24 * 60 * 60 * 1000; //15 days * 24hs * 60min * 60 seg * 1000ms
      const oldDateLimit = query.oldDate - fifteenDays;
      const newDateLimit = query.newDate - fifteenDays;
      console.log("Old date limit", oldDateLimit);
      console.log("New date limit", newDateLimit);
      console.log("query que recibió results:", query);
      try {
        /* -------- CONSULTA DB ---------------- */

        let blueValuesOld = await db
          .collection("blue")
          .where("timestamp", ">=", oldDateLimit)
          .where("timestamp", "<=", query.oldDate)
          .get();

        let officialValuesOld = await db
          .collection("official")
          .where("timestamp", ">=", oldDateLimit)
          .where("timestamp", "<=", query.oldDate)
          .get();

        let uvaValuesOld = await db
          .collection("uva")
          .where("timestamp", ">=", oldDateLimit)
          .where("timestamp", "<=", query.oldDate)
          .get();

        let blueValuesNew = await db
          .collection("blue")
          .where("timestamp", ">=", newDateLimit)
          .where("timestamp", "<=", query.newDate)
          .get();

        let officialValuesNew = await db
          .collection("official")
          .where("timestamp", ">=", newDateLimit)
          .where("timestamp", "<=", query.newDate)
          .get();

        let uvaValuesNew = await db
          .collection("uva")
          .where("timestamp", ">=", newDateLimit)
          .where("timestamp", "<=", query.newDate)
          .get();

        blueValuesOld = blueValuesOld.docs.map((doc) => {
          return { ...doc.data(), id: doc.id };
        });
        officialValuesOld = officialValuesOld.docs.map((doc) => {
          return { ...doc.data(), id: doc.id };
        });
        uvaValuesOld = uvaValuesOld.docs.map((doc) => {
          return { ...doc.data(), id: doc.id };
        });
        blueValuesNew = blueValuesNew.docs.map((doc) => {
          return { ...doc.data(), id: doc.id };
        });
        officialValuesNew = officialValuesNew.docs.map((doc) => {
          return { ...doc.data(), id: doc.id };
        });
        uvaValuesNew = uvaValuesNew.docs.map((doc) => {
          return { ...doc.data(), id: doc.id };
        });

        /* ---- Cargo resultados en State ---- */
        setBlueValues({ old: blueValuesOld, new: blueValuesNew });
        setOfficialValues({ old: officialValuesOld, new: officialValuesNew });
        setUvaValues({ old: uvaValuesOld, new: uvaValuesNew });
        setFetchedData(true);
      } catch (err) {
        console.log("Ha ocurrido un error", err);
      }
    };

    fetchData(props.query);
  }, [props]);

  useEffect(() => {
    if (fetchedData) {
      calculateResults();
    }
  }, [fetchedData]);

  const averageValueOf = (array, key) => {
    /* Calcula el promedio de un valor que se encuentra
    en un array de objetos */
    if (array.length === 0) {
      return -1;
    }
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

  const calculateResults = () => {
    // Valores promedio de las cotizaciones:
    const dolarBlueOldAvg = averageValueOf(blueValues.old, "venta");
    const dolarBlueNewAvg = averageValueOf(blueValues.new, "venta");
    const dolarOficialOldAvg = averageValueOf(officialValues.old, "venta");
    const dolarOficialNewAvg = averageValueOf(officialValues.new, "venta");
    const uvaOldAvg = inUvaEra(props.query.oldDate)
      ? averageValueOf(uvaValues.old, "valor")
      : null;
    const uvaNewAvg = inUvaEra(props.query.newDate)
      ? averageValueOf(uvaValues.new, "valor")
      : null;

    // Junto los resultados para devolverlos:

    const calculatedResults = {
      oldBlueAvg: parseFloat(dolarBlueOldAvg),
      oldOficialAvg: parseFloat(dolarOficialOldAvg),
      uvaOldAvg: uvaOldAvg ? parseFloat(uvaOldAvg) : uvaOldAvg,
      newBlueAvg: parseFloat(dolarBlueNewAvg),
      newOficialAvg: parseFloat(dolarOficialNewAvg),
      uvaNewAvg: uvaNewAvg ? parseFloat(uvaNewAvg) : uvaNewAvg,
      oldAmmountBlue: parseFloat(props.query.oldAmmount / dolarBlueOldAvg),
      oldAmmountOficial: parseFloat(
        props.query.oldAmmount / dolarOficialOldAvg
      ),
      oldAmmountUva: uvaOldAvg
        ? parseFloat(props.query.oldAmmount / uvaOldAvg)
        : uvaOldAvg,
      newAmmountBlue: parseFloat(props.query.newAmmount / dolarBlueNewAvg),
      newAmmountOficial: parseFloat(
        props.query.newAmmount / dolarOficialNewAvg
      ),
      newAmmountUva: uvaNewAvg
        ? parseFloat(props.query.newAmmount / uvaNewAvg)
        : uvaNewAvg,
    };

    const dataForCharts = [
      {
        name: "Old",
        date: props.query.oldDate,
        pesos: props.query.oldAmmount,
        oficial: calculatedResults.oldAmmountOficial,
        blue: calculatedResults.oldAmmountBlue,
        uva: calculatedResults.oldAmmountUva,
      },
      {
        name: "New",
        date: props.query.newDate,
        pesos: props.query.newAmmount,
        oficial: calculatedResults.newAmmountOficial,
        blue: calculatedResults.newAmmountBlue,
        uva: calculatedResults.newAmmountUva,
      },
    ];
    setResults(calculatedResults);
    // console.log("data for charts:", dataForCharts);
    setChartData(dataForCharts);
    setLoading(false);
  };

  return (
    <div>
      <NavigationBar />
      {!loading && (
        <ResultsViewer
          query={props.query}
          results={results}
          chartData={chartData}
          inUvaEra={
            inUvaEra(props.query.oldDate) && inUvaEra(props.query.newDate)
          }
        />
      )}
    </div>
  );
};

// Subcomponents:

export const ResultsViewer = (props) => {
  const oldDate = props.query.oldDate;
  const newDate = props.query.newDate;
  const data = props.chartData;

  const {
    oldBlueAvg,
    newBlueAvg,
    oldOficialAvg,
    newOficialAvg,
    uvaOldAvg,
    uvaNewAvg,
    oldAmmountBlue,
    newAmmountBlue,
    oldAmmountOficial,
    newAmmountOficial,
    oldAmmountUva,
    newAmmountUva,
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
                  <th scope="row">Valor Uva</th>
                  <td>{uvaOldAvg ? uvaOldAvg.toFixed(2) : "-"}</td>
                  <td>{uvaNewAvg ? uvaNewAvg.toFixed(2) : "-"}</td>
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
                <tr>
                  <th scope="row">Monto en UVAs</th>
                  <td>{oldAmmountUva ? oldAmmountUva.toFixed(2) : "-"}</td>
                  <td>{newAmmountUva ? newAmmountUva.toFixed(2) : "-"}</td>
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
              <div
                className="d-flex flex-column align-items-center justify-content-center"
                style={{ padding: "40px 20px" }}
              >
                {oldAmmountUva && newAmmountUva && (
                  <p>
                    <span className="txt-color-1 font-weight-bold">
                      Variacion porcentual en UVAS:
                    </span>
                    {parseFloat(
                      (newAmmountUva * 100) / oldAmmountUva - 100
                    ).toFixed(2)}
                    %
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-2"></div>
      </div>
    </React.Fragment>
  );
};

export const DolarLineChart = (props) => {
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

export const UvaLineChart = (props) => {
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
