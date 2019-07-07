import React, { Component } from "react";
import logo from "./logo.svg";
import "./App.css";

class LambdaDemo extends Component<
  {},
  { loading: boolean; msg: string | null }
> {
  constructor(props: any) {
    super(props);
    this.state = { loading: false, msg: null };
  }

  handleClick = (api: string) => (e: React.MouseEvent) => {
    e.preventDefault();

    this.setState({ loading: true });
    fetch(api)
      .then(response => response.json())
      .then(json => this.setState({ loading: false, msg: json.msg }));
  };

  render() {
    const { loading, msg } = this.state;

    return (
      <p>
        <button onClick={this.handleClick("hello")}>
          {loading ? "Loading..." : "Call Lambda"}
        </button>
        <button onClick={this.handleClick("async-dadjoke")}>
          {loading ? "Loading..." : "Call Async Lambda"}
        </button>
        <br />
        <span>{msg}</span>
      </p>
    );
  }
}

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            Edit <code>src/App.js</code> and save to reload.
          </p>
          <LambdaDemo />
        </header>
      </div>
    );
  }
}

export default App;
