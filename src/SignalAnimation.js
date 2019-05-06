import React from "react";

import "./SignalAnimation.css";

const SignalAnimation = () => {
  return (
    <div className="beacon-wrapper">
      <span className="signal beacon--epicentre" />
      <span className="signal signal--wave" />
      <span className="signal signal--wave signal--delay" />
    </div>
  );
};

export default SignalAnimation;

// credits:  https://codepen.io/khalidl/pen/mOQLVQ
