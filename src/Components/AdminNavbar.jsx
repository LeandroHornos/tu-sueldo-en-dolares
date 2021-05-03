import React from "react";

import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";

const AdminNavbar = () => {
  return (
    <Navbar collapseOnSelect expand="lg" bg="success" variant="dark">
      <Navbar.Brand href="/controlpanel">Control Panel</Navbar.Brand>
      <Navbar.Toggle aria-controls="responsive-navbar-nav" />
      <Navbar.Collapse id="responsive-navbar-nav">
        <Nav className="mr-auto">
          <Nav.Link href="/">Home</Nav.Link>
          <Nav.Link href="/controlpanel/nuevacotizacion">
            Nueva cotizacion
          </Nav.Link>
          <Nav.Link href="/controlpanel/cotizaciones">Cotizacones</Nav.Link>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
};

export default AdminNavbar;
