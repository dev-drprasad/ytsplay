import React from 'react';

import './SignalAnimation.css';


const SignalAnimation = () => {
  return (
    <div className="beacon-wrapper">
  <span className="signal beacon--epicentre"></span>
  <span className="signal signal--wave"></span>
  <span className="signal signal--wave signal--delay"></span>
</div>
  )
}

export default SignalAnimation;

// credits:  https://codepen.io/khalidl/pen/mOQLVQ
