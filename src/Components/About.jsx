import React from "react";

import NavigationBar from "./NavigationBar";

const About = () => {
  return (
    <React.Fragment>
      <NavigationBar />
      <div className="row">
        <div className="col-md-3"></div>
        <div className="col-md-6">
          <h1 className="text-center txt-color-1">
            Acerca de ¿Cómo varió en dólares?
          </h1>

          <div>
            <h2 className="text-center txt-color-1">
              Renuncia de responsabilidad
            </h2>
            <p>
              <h3>
                Lee este descargo de responsabilidad detenidamente antes de
                utilizar el sitio web de "¿Cómo varió en dolares?".
              </h3>
              {/* <p>
                El contenido que se muestra en el sitio web es propiedad
                intelectual de comovarioendolares.com. No puedes reutilizar, volver a
                publicar o reimprimir dicho contenido sin nuestro consentimiento
                por escrito, exceptuando los resultados arrojados por la
                aplicación, los cuales pueden ser compartidos libremente.{" "}
              </p> */}
              <p>
                Toda la información publicada es meramente para fines educativos
                e informativos. No está destinado como sustituto del
                asesoramiento profesional. Si decides actuar sobre la base de
                cualquier información sobre este sitio web, lo haces bajo tu
                propio riesgo. Si bien la información de este sitio web ha sido
                verificada de la mejor manera posible, no podemos Garantizar que
                no haya errores ni equivocaciones. Nos reservamos el derecho de
                cambiar esta política en cualquier momento, de lo cual se te
                informará de inmediato. Si deseas asegurarte de estar
                actualizado/a con los últimos cambios, te recomendamos visitar
                con frecuencia esta página.
              </p>
            </p>
          </div>
        </div>
        <div className="col-md-3"></div>
      </div>
    </React.Fragment>
  );
};

export default About;
