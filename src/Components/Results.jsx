import React, { useEffect, useState } from "react";

import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

import dolarblue from "../dolarblue.json";
import dolaroficial from "../dolaroficial.json";

const Results = () => {
  const blue = dolarblue.map((doc) => {
    const dma = doc.fecha.split("-");
    return {
      day: dma[0],
      month: dma[1],
      year: dma[2],
      date: doc.fecha,
      compra: doc.compra,
      venta: doc.venta,
    };
  });

  const [oldSalaryAmmount, setOldSalaryAmmount] = useState(null);
  const [newSalaryAmmount, setNewSalaryAmmount] = useState(null);
  const [oldSalaryDate, setOldSalaryDate] = useState({
    day: "",
    month: "",
    year: "",
  });
  const [newSalaryDate, setNewSalaryDate] = useState({
    day: "",
    month: "",
    year: "",
  });
  const handleSubmit = () => {
    //
    return;
  };

  return (
    <React.Fragment>

    </React.Fragment>
  );
};

export default Results;
