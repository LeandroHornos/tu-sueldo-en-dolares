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
      compra: doc.compra,
      venta: doc.venta,
    };
  });

  const calculateResults = (query) => {
    // Viejo salario: Este filtrado del json se reemplazarar por una query en la base de datos
    const dolarValuesOld = blue.filter((value) => {
      return (
        value.year === query.oldSalaryDate.year &&
        value.month === query.oldSalaryDate.month
      );
    });
    const dolarValuesNew = blue.filter((value) => {
      return (
        value.year === query.newSalaryDate.year &&
        value.month === query.newSalaryDate.month
      );
    });
    console.log("Dolar values:", dolarValuesOld, dolarValuesNew);
  };

  return <React.Fragment></React.Fragment>;
};

export default Results;
