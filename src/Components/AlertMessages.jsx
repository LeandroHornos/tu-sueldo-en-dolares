import React from "react";

import Alert from "react-bootstrap/Alert";

const AlertMessages = (props) => {
  return (
    <div>
      {props.messages.map((msg, index) => {
        return (
          <Alert
            key={index}
            variant={msg.type === "error" ? "danger" : "success"}
          >
            {msg.text}
          </Alert>
        );
      })}
    </div>
  );
};

export default AlertMessages;
