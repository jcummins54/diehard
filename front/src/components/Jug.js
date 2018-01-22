import React from 'react';

const SIZE_FACTOR = 30;

export default class Jug extends React.Component {
  render() {
    const outerDiv = {
      height: this.props.size * SIZE_FACTOR,
    };
    const innerDiv = {
      position: "absolute",
      bottom: 0,
      display: "block",
      background: "linear-gradient(to bottom, #4290ff99 0%,#4778ff33 100%) no-repeat",
      width: 150,
      transition: "height .2s ease-out",
      height: this.props.amount * SIZE_FACTOR,
    };
    return (
      <div className="jug">
        <div>{this.props.amount}</div>
        <div style={outerDiv} className="outerDiv">
          <div style={innerDiv} className="innerDiv"></div>
        </div>
      </div>
    );
  }
}