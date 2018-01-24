import React, { Component } from 'react';
import axios from 'axios';
import './App.css';
import BasicForm from './components/BasicForm';
import Jug from './components/Jug';

// TODO: use environment variables
const BASE_URL = "http://localhost:3000/solutions/";
// const BASE_URL = "https://zxjkw8xneg.execute-api.us-east-1.amazonaws.com/dev/solutions/";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      jug1: 3.0,
      jug1Size: 3.0,
      jug1Amount: 0.0,
      jug2: 5.0,
      jug2Size: 5.0,
      jug2Amount: 0.0,
      target: 4.0,
      winner: "",
      result: "",
      currentStep: 0,
      stepList: [],
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.animateTimeout = 0;
  }

  handleChange(event) {
    clearTimeout(this.animateTimeout);
    let value = parseFloat(event.target.value).toFixed(2);
    if (isNaN(value)) {
      value = 0;
    }
    let props = {
      winner: "",
      result: "",
      jug1Amount: 0.0,
      jug2Amount: 0.0,
      currentStep: 0,
      stepList: [],
    };

    // Only allow numbers and decimal
    let val = event.target.value.toString().replace(/[^0-9.]/g, "");
    // Restrict to 2 decimal places
    if (val.indexOf('.') > -1) {
      val = val.substring(0, val.indexOf('.') + 3);
    }
    props[event.target.name] = val;
    props[`${event.target.name}Size`] = value;
    this.setState(props);
  }

  handleSubmit(event) {
    event.preventDefault();
    if (this.state.jug1Size <= 0
      || this.state.jug2Size <= 0
      || (this.state.target <= 0)
    ) {
      alert("Please enter decimal amounts for jug 1, jug 2 and target.");
      return;
    }
    if (this.state.target > this.state.jug1Size && this.state.target > this.state.jug2Size) {
      alert("The target amount must be a number greater than 0 and less than the largest jug.");
      return;
    }
    const id = `${this.state.jug1Size}-${this.state.jug2Size}-${this.state.target}`;
    axios.get(`${BASE_URL}${id}`).then((response) => {
      this.handleResponse(response.data);
    }).catch((error) => {
      console.log(error);
    });
  }

  handleResponse(data) {
    let result = "";
    let props = {};
    let shouldDoAnimation = false;
    if (data.winner === "1" || data.winner === "2") {
      shouldDoAnimation = true;
      result = `Filling jug ${data.winner} first is faster.`;
      const winner = parseInt(data.winner, 10) - 1;
      const stepList = data.stepList[winner];
      props = {
        jug1Amount: stepList[stepList.length - 1].jugs[0],
        jug2Amount: stepList[stepList.length - 1].jugs[1],
        currentStep: 0,
        stepList: stepList,
      }
    } else {
      result = "No winner. Repeated hash or recursion limit reached.";
    }
    result = `${result} 1st round: ${data.results[0].count} steps, 2nd round: ${data.results[1].count} steps.`;
    props = {
      ...props,
      winner: data.winner,
      result: result,
    };
    this.setState(props);

    if (shouldDoAnimation) {
      clearTimeout(this.animateTimeout);
      this.animateTimeout = setTimeout(() => {
        this.doAnimation()
      }, 300);
    }
  }

  doAnimation() {
    this.setState((prevState, props) => {
      if (prevState.currentStep < prevState.stepList.length - 1) {
        clearTimeout(this.animateTimeout);
        this.animateTimeout = setTimeout(() => {
          this.doAnimation()
        }, 300);
      }
      return {
        jug1Amount: prevState.stepList[prevState.currentStep].jugs[0],
        jug2Amount: prevState.stepList[prevState.currentStep].jugs[1],
        currentStep: prevState.currentStep + 1,
      }
    });
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
              <Jug id="jug1" amount={this.state.jug1Amount} size={this.state.jug1Size} />
              <Jug id="jug2" amount={this.state.jug2Amount} size={this.state.jug2Size} />
            </div>
            <div className="results">{this.state.result}</div>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
