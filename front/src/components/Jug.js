import React from 'react';

const SIZE_FACTOR = 30;

export default class Jug extends React.Component {
  render() {
    const outerDiv = {
      position: "relative",
      bottom: 0,
      display: "block",
      border: "1px solid #333",
      backgroundColor: "#CCC",
      width: 150,
      height: this.props.size * SIZE_FACTOR,
    };
    const innerDiv = {
      position: "absolute",
      bottom: 0,
      display: "block",
      backgroundColor: "#9CF",
      width: 150,
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