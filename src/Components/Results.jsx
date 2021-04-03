import React, { useEffect, useState } from "react";

import dolarblue from "../dolarblue.json";
import dolaroficial from "../dolaroficial.json";

const Results = (props) => {
  const [currentQuery, setCurrentQuery] = useState(props.query);
  const [results, setResults] = useState(null);

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
    console.log("viejo promedio blue: ", dolarBlueOldAvg);
    console.log("nuevo promedio blue: ", dolarBlueNewAvg);
    console.log("viejo promedio oficial: ", dolarOficialOldAvg);
    console.log("nuevo promedio oficial: ", dolarOficialNewAvg);
  };

  return <React.Fragment></React.Fragment>;
};

export default Results;
