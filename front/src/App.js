import React, { Component } from 'react';
import axios from 'axios';
import './App.css';
import BasicForm from './components/BasicForm';
import Jug from './components/Jug';

const BASE_URL = "http://localhost:3000/solutions/";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      jug1: 3.0,
      jug1Amount: 0.0,
      jug2: 5.0,
      jug2Amount: 0.0,
      target: 4.0,
      winner: "",
      result: "",
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    let value = parseFloat(event.target.value);
    if (isNaN(value)) {
      value = "";
    }
    let props = { winner: "", result: "" };
    props[event.target.name] = value;
    this.setState(props);
  }

  handleSubmit(event) {
    event.preventDefault();
    if (this.state.jug1 <= 0
      || this.state.jug2 <= 0
      || (this.state.target <= 0)
    ) {
      alert("Please enter decimal amounts for jug 1, jug 2 and target.");
      return;
    }
    if (this.state.target > this.state.jug1 && this.state.target > this.state.jug2) {
      alert("The target amount must be a number greater than 0 and less than the largest jug.");
      return;
    }
    console.log(this.state);
    const id = `${this.state.jug1}-${this.state.jug2}-${this.state.target}`;
    axios.get(`${BASE_URL}${id}`).then((response) => {
      this.doAnimation(response.data);
    })
      .catch((error) => {
        console.log(error);
      });
  }

  doAnimation(data) {
    console.log(">>> data:", data);
    let result = "";
    if (data.winner === "1" || data.winner === "2") {
      result = `Filling ${data.winner} is faster.`;
    } else {
      result = "No winner.";
    }
    result = `${result} 1st round: ${data.results[0].count} steps, 2nd round: ${data.results[1].count} steps.`
    this.setState({ winner: data.winner, result: result });
  }

  render() {
    return (
      <div className="App">
        <div className="App-intro">
          <BasicForm
            onChange={this.handleChange}
            onSubmit={this.handleSubmit}
            jug1={this.state.jug1}
            jug2={this.state.jug2}
            target={this.state.target}
          />
          <div className="jugContainer">
            <div className="jugs">
              <Jug id="jug1" amount={this.state.jug1Amount} size={this.state.jug1} />
              <Jug id="jug2" amount={this.state.jug2Amount} size={this.state.jug2} />
            </div>
            <div className="results">{this.state.result}</div>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
