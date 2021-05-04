import React, { useEffect, useState } from "react";

import { useHistory } from "react-router-dom";

import AlertMessages from "./AlertMessages";
import NavigationBar from "./NavigationBar";

export const dateToTimestamp = (date) => {
  let myDate = new Date(date);
  myDate = myDate.getTime();
  return myDate;
};

export const formatDate = (date) => {
  // Separa la fecha en dia, mes, año para facilitar el filtrado
  let ymd = date.split("-");
  return {
    day: parseInt(ymd[2]),
    month: parseInt(ymd[1]),
    year: parseInt(ymd[0]),
  };
};

const Query = (props) => {
  const history = useHistory();
  //State
  const [oldAmmount, setOldAmmount] = useState("");
  const [newAmmount, setNewAmmount] = useState("");
  const [oldDate, setOldDate] = useState("");
  const [newDate, setNewDate] = useState("");
  const [msgs, setMsgs] = useState([]);

  const validateForm = () => {
    let isValid = true;
    let errors = [];
    // Si se ingresaron fechas, las formateo a dia, mes año:
    const od = oldDate === "" ? oldDate : formatDate(oldDate);
    const nd = newDate === "" ? newDate : formatDate(newDate);
    // Error: hay campos sin completar:
    if (oldAmmount === "" || newAmmount === "" || od === "" || nd === "") {
      errors.push({ type: "error", text: "Debes completar todos los campos" });
      isValid = false;
    }
    // Error: alguna fecha es anterior a febrero 2012
    if (
      (od !== "" && od.year < 2012) ||
      (nd !== "" && nd.year < 2012) ||
      (od !== "" && od.year === 2012 && od.month < 2) ||
      (nd !== "" && nd.year === 2012 && nd.month < 2)
    ) {
      errors.push({
        type: "error",
        text: "Las fechas deben ser posteriores a enero de 2012",
      });
      isValid = false;
    }
    // Error: la segunda fecha es anterior a la primera
    if (od !== "" && nd !== "") {
      if (
        nd.year < od.year ||
        (nd.year === od.year && nd.month < od.month) ||
        (nd.year === od.year && nd.month === od.month && nd.day < od.day)
      ) {
        errors.push({
          type: "error",
          text: "La segunda fecha debe ser posterior a la primera",
        });
        isValid = false;
      }
    }
    return { isValid, errors };
  };
  const dateToDMY = (date) => {
    const dateObj = new Date(date);
    return {
      day: dateObj.getDate(),
      month: dateObj.getMonth() + 1,
      year: dateObj.getFullYear(),
    };
  };
  const handleSubmit = () => {
    const { isValid, errors } = validateForm();

    if (isValid) {
      const query = {
        oldDMY: dateToDMY(oldDate),
        newDMY: dateToDMY(newDate),
        oldAmmount: parseFloat(oldAmmount),
        newAmmount: parseFloat(newAmmount),
        oldDate: dateToTimestamp(oldDate),
        newDate: dateToTimestamp(newDate),
        date: new Date(),
      };
      // console.log(query);
      props.setQuery(query);
      console.log(query);
      history.push("/results");
    } else {
      setMsgs([...errors]);
    }
  };

  return (
    <React.Fragment>
      <NavigationBar />
      <div className="row">
        <div className="col-md-1"></div>
        <div className="col-md-7">
          <div className="cont">
            <header>
              <h1 className="txt-color-1 text-center">
                ¿ Cómo varió en dólares ?
              </h1>
              <p>
                El objetivo de esta página es ayudar a aquellas personas que
                residen en la República Argentina a comprender cómo varía su
                poder adquisitivo a lo largo del tiempo, al comparar cifras en
                pesos convirtiéndolas a otros valores de referencia a la fecha
                indicada, como ser el dolar o la Unidad de Valor Adquisitivo
                UVA.
              </p>
              <p>
                ¿Hoy ganás muchos más pesos que hace unos años, pero sentís que
                comprás mucho menos?{" "}
                <strong>
                  {" "}
                  Compará como variaron entre dos fechas tu salario, tu alquiler,
                  la cuota del préstamo o cualquier otro monto en pesos
                  argentinos convirtiéndolos en su equivalente en dólares
                  utilizando esta aplicación.
                </strong>{" "}
                Completá los montos en pesos correspondientes a dos fechas
                distintas y dale al botón "calcular" para ver los resultados.
              </p>
            </header>
            <section id="seccion-formulario-busqueda">
              <form>
                <div className="mb-3">
                  <label htmlFor="old-date" className="form-label">
                    Fecha inicial:
                  </label>
                  <p className="form-text">
                    La fecha inicial debe ser posterior a junio de 2012
                  </p>
                  <input
                    type="date"
                    className="form-control"
                    aria-describedby="dateHelp"
                    id="old-date"
                    onChange={(e) => {
                      setOldDate(e.target.value);
                    }}
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="old-ammount" className="form-label">
                    Monto anterior en pesos argentinos:
                  </label>
                  <input
                    type="number"
                    className="form-control"
                    id="old-ammount"
                    value={oldAmmount}
                    onChange={(e) => {
                      setOldAmmount(e.target.value);
                    }}
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="new-date" className="form-label">
                    Fecha final:
                  </label>
                  <p className="form-text">
                    La fecha final debe ser posterior a la inicial y anterior o
                    igual a la fecha de hoy.
                  </p>
                  <input
                    type="date"
                    className="form-control"
                    aria-describedby="dateHelp"
                    id="new-date"
                    onChange={(e) => {
                      setNewDate(e.target.value);
                    }}
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="new-ammount" className="form-label">
                    Nuevo monto en pesos argentinos:
                  </label>
                  <input
                    type="number"
                    className="form-control"
                    id="new-ammount"
                    value={newAmmount}
                    onChange={(e) => {
                      setNewAmmount(e.target.value);
                    }}
                  />
                </div>
                <AlertMessages messages={msgs} />
                <button
                  type="submit"
                  className="btn btn-success btn-block"
                  onClick={(e) => {
                    e.preventDefault();
                    handleSubmit();
                  }}
                >
                  Calcular
                </button>
              </form>
            </section>
          </div>
        </div>
        <div className="col-md-4">
          <aside></aside>
        </div>
      </div>
      <div className="row">
        <div className="col-md-1"></div>
        <div className="col-md-7">
          <main>
            <section id="informacion-general">
              <article id="que-es-el-dolar-blue">
                <h2 className="txt-color-1 text-center">
                  ¿Qué es el dolar blue?
                </h2>
                <p>
                  El dólar blue, dólar paralelo o dólar negro, son eufemismos
                  que se utilizan en Argentina para referirse al dólar
                  estadounidense comprado ilegalmente en el mercado negro. Suele
                  tener un tipo de cambio que se encuentra muy por encima del
                  dólar oficial.
                </p>
                <p>
                  Este concepto se empezó a utilizar en el país sudamericano en
                  2011, como consecuencia de las restricciones, bajo el gobierno
                  de Cristina Fernández de Kirchner, para la adquisición de
                  moneda extranjera impuestas por la Administración Federal de
                  Ingresos Públicos y el Banco Central de la República
                  Argentina.
                </p>
              </article>
              <article id="que-es-el-valor-uva">
                <h2 className="txt-color-1 text-center">¿Qué es UVA?</h2>
                <p>
                  <strong>
                    La Unidad de Valor Adquisitivo UVA equivale a la milésima
                    parte del costo promedio de construcción de un metro
                    cuadrado de vivienda.
                  </strong>{" "}
                  El valor se actualiza diariamente en función a la variación
                  del CER (Coeficiente de Estabilización de Referencia), basado
                  en el índice de precios al consumidor. El valor de la UVA en
                  pesos se publica en el Banco Central de la República
                  Argentina.
                </p>
                <p>
                  De esta forma, la estrategia detrás de las UVA consiste en que
                  la misma se ajuste a la evolución del costo de construcción.
                  Es decir, la UVA se indexa a alguna variable que refleje la
                  evolución de los precios del sector que genera la necesidad de
                  tomar créditos hipotecarios. La finalidad que se persigue es
                  la de expresar los precios de transacciones de largo plazo en
                  moneda local (el peso), para desacoplarlas de las variaciones
                  de una extranjera (el dólar). La dificultad es que el flujo de
                  ingresos de los potenciales tomadores de crédito, se
                  encuentran expresados en pesos y, por tanto, no necesariamente
                  ajustan a la misma velocidad o nivel que la UVA.
                </p>
                <p>
                  Asimismo, dado que el CER se calcula de forma diaria y el IPC
                  (Índice de Precios al Consumidor) de forma mensual (y
                  desfasada); el primero es un tipo de proyección geométrica del
                  IPC que calcula –nuevamente- el BCRA. Finalmente, el IPC se
                  encuentra en función de la variación de precios de una canasta
                  de bienes y servicios representativa de la población, estimada
                  por el INDEC.
                </p>
              </article>
            </section>
          </main>
        </div>
        <div className="col-md-4">
          <aside></aside>
        </div>
      </div>
    </React.Fragment>
  );
};

export default Query;
