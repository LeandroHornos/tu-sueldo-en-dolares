import React from "react";

import dolarblue from "../dolarblue.json";
import dolaroficial from "../dolaroficial.json";

import Button from "react-bootstrap/Button";

const Admin = () => {
  const logDolarBlue = () => {
    console.log(dolarblue);
  };
  const logDolarOficial = () => {
    console.log(dolaroficial);
  };
  return (
    <div>
      <Button
        block
        onClick={() => {
          logDolarBlue();
        }}
      >
        Log Dolar Blue
      </Button>
      <Button
        block
        onClick={() => {
          logDolarOficial();
        }}
      >
        Log Dolar Oficial
      </Button>
    </div>
  );
};

export default Admin;
