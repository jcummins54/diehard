import React from 'react';
import axios from 'axios';

export default class BasicForm extends React.Component {

  render() {
    const formStyle = {
      label: {
        marginRight: "1rem",
        fontSize: "1rem",
      },
      input: {
        marginRight: "1rem",
        fontSize: "1rem",
        width: "5rem",
        height: "1.5rem",
      },
      button: {
        borderRadius: "0px",
        color: "#ffffff",
        fontSize: "1rem",
        background: "#3498db",
        padding: "5px 10px",
        textDecoration: "none",
      }
    };
    return (
      <form id="form2" onSubmit={this.props.onSubmit}>
        <label style={formStyle.label} htmlFor="jug1">Jug 1:</label>
        <input onChange={this.props.onChange} value={this.props.jug1} type="text" style={formStyle.input} name="jug1" id="jug1" />
        <label style={formStyle.label} htmlFor="jug2">Jug 2:</label>
        <input onChange={this.props.onChange} value={this.props.jug2} type="text" style={formStyle.input} name="jug2" id="jug2" />
        <label style={formStyle.label} htmlFor="target">Target:</label>
        <input onChange={this.props.onChange} value={this.props.target} type="text" style={formStyle.input} name="target" id="target" />
        <button style={formStyle.button} type="submit" className="mb-4 btn btn-primary">Submit</button>
      </form>
    );
  }
}