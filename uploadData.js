const admin = require("firebase-admin");

const serviceAccount = require("./pKey.json");

let dolarblue = require("./src/dolarblue.json");
let dolaroficial = require("./src/dolaroficial.json");
let uvas = require("./src/uva.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const firestore = admin.firestore();

const dateToTimestamp = (date) => {
  const dmy = date.split("/");
  const d = dmy[0];
  const m = dmy[1];
  const y = dmy[2];
  let myDate = new Date(`${y}-${m}-${d}`);
  myDate = myDate.getTime();
  return myDate;
};

// dolarblue = dolarblue.map((obj) => {
//   const { fecha, compra, venta } = obj;
//   return {
//     fecha,
//     compra: parseFloat(compra),
//     venta: parseFloat(venta),
//     timestamp: parseInt(dateToTimestamp(fecha)),
//   };
// });

// dolaroficial = dolaroficial.map((obj) => {
//   const { fecha, compra, venta } = obj;
//   return {
//     fecha,
//     compra: parseFloat(compra),
//     venta: parseFloat(venta),
//     timestamp: parseInt(dateToTimestamp(fecha)),
//   };
// });

uvas = uvas.map((obj) => {
  const { fecha, uva } = obj;
  return {
    fecha,
    valor: parseFloat(uva),
    timestamp: parseInt(dateToTimestamp(fecha)),
  };
});

const sabeDocumentToFirestore = async (obj, collectionName) => {
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
    sabeDocumentToFirestore(obj, collectionName);
    counter = counter + 1;
    console.log("saved", counter);
  });
};

console.log("documentos a guardar en dolar blue: ", dolarblue.length);

saveDataToFirestore(uvas, "uva");
