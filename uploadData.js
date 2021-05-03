const admin = require("firebase-admin");

const serviceAccount = require("./pKey.json");

let dolarblue = require("./src/dolarblue.json");
let dolaroficial = require("./src/dolaroficial.json");
let uvas = require("./src/uva.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const firestore = admin.firestore();

const dateToDMY = (date) => {
  let dmy = [];
  if (date.includes("/")) {
    dmy = date.split("/");
  } else {
    dmy = date.split("-");
  }
  return {
    day: parseInt(dmy[0]),
    month: parseInt(dmy[1]),
    year: parseInt(dmy[2]),
  };
};

const dateToTimestamp = (date) => {
  const { day, month, year } = dateToDMY(date);
  let myDate = new Date(`${year}-${month}-${day}`);
  myDate = myDate.getTime();
  return myDate;
};

dolarblue = dolarblue.map((obj) => {
  let { fecha, compra, venta } = obj;
  const { day, month, year } = dateToDMY(fecha);
  compra = parseFloat(compra.toString().replace(",", "."));
  venta = parseFloat(venta.toString().replace(",", "."));
  return {
    day,
    month,
    year,
    compra,
    venta,
    timestamp: parseInt(dateToTimestamp(fecha)),
  };
});

dolaroficial = dolaroficial.map((obj) => {
  let { fecha, compra, venta } = obj;
  const { day, month, year } = dateToDMY(fecha);
  compra = parseFloat(compra.toString().replace(",", "."));
  venta = parseFloat(venta.toString().replace(",", "."));
  return {
    day,
    month,
    year,
    compra,
    venta,
    timestamp: parseInt(dateToTimestamp(fecha)),
  };
});

uvas = uvas.map((obj) => {
  let { fecha, uva } = obj;
  const { day, month, year } = dateToDMY(fecha);
  uva = parseFloat(uva.toString().replace(",", "."));
  return {
    day,
    month,
    year,
    valor: uva,
    timestamp: parseInt(dateToTimestamp(fecha)),
  };
});

const saveDocumentToFirestore = async (obj, collectionName) => {
  try {
    await firestore.collection(collectionName).add(obj);
    counter = counter + 1;
  } catch {
    (err) => console.log(err);
  }
};
const saveDataToFirestore = (docsArray, collectionName) => {
  let counter = 0;
  docsArray.forEach((obj) => {
    saveDocumentToFirestore(obj, collectionName);
    counter = counter + 1;
    console.log("saved", counter);
  });
};

console.log("documentos a guardar en dolar oficial: ", uvas.length);

saveDataToFirestore(uvas, "uva");
