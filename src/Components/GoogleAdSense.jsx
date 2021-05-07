import React, { Component, useState, useEffect } from "react";
import PropTypes from "prop-types";

const googleAdId = "ca-pub-yourGoogleAdId";

export const GoogleAd = (props) => {
  const { classNames, slot } = this.props;
  const [googleInit, setGoogleInit] = useState(null);

  useEffect(() => {
    const { timeout } = this.props;
    const init = setTimeout(() => {
      if (typeof window !== "undefined")
        (window.adsbygoogle = window.adsbygoogle || []).push({});
    }, timeout);
    setGoogleInit(init);

    return function cleanup() {
      if (googleInit) clearTimeout(googleInit);
    };
  }, []);

  return (
    <div className={classNames}>
      <ins
        className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-client={googleAdId}
        data-ad-slot={slot}
        data-ad-format="auto"
        data-full-width-responsive="true"
      ></ins>
    </div>
  );
};

GoogleAd.propTypes = {
  classNames: PropTypes.string,
  slot: PropTypes.string,
  timeout: PropTypes.number,
};

GoogleAd.defaultProps = {
  classNames: "",
  timeout: 200,
};

export default GoogleAdClass;
