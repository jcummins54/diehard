import React, { Component } from 'react';
import axios from 'axios';
import './App.css';
import BasicForm from './components/BasicForm';
import Jug from './components/Jug';

// Once you deploy the serverless app, replace the BASE_URL with the GET endpoint it gives you.
const BASE_URL = process.env.REACT_APP_LOCAL ? "http://localhost:3000/dev/solutions/" :
  "https://zxjkw8xneg.execute-api.us-east-1.amazonaws.com/dev/solutions/";

const ANIMATION_PAUSE = 500;

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      jug1: 3.0,
      jug1Amount: 0.0,
      jug2: 5.0,
      jug2Amount: 0.0,
      goal: 4.0,
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
    // Reset values from any previous submission
    clearTimeout(this.animateTimeout);
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
    this.setState(props);
  }

  handleSubmit(event) {
    event.preventDefault();
    if (+this.state.jug1 <= 0 || +this.state.jug2 <= 0 || +this.state.goal <= 0) {
      alert("Please enter decimal amounts for jug 1, jug 2 and goal.");
      return;
    }
    if (+this.state.goal > +this.state.jug1 && +this.state.goal > +this.state.jug2) {
      alert("The goal amount must be a number greater than 0 and less than the largest jug.");
      return;
    }
    const id = `${this.state.jug1}-${this.state.jug2}-${this.state.goal}`;
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
        jug1Amount: 0,
        jug2Amount: 0,
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
      }, ANIMATION_PAUSE);
    }
  }

  doAnimation() {
    this.setState((prevState, props) => {
      if (prevState.currentStep < prevState.stepList.length - 1) {
        clearTimeout(this.animateTimeout);
        this.animateTimeout = setTimeout(() => {
          this.doAnimation()
        }, ANIMATION_PAUSE);
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
            goal={this.state.goal}
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
