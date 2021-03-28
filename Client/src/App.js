import React, { Component } from 'react';
import './App.scss';
import ChessCount from "./components/ChessCount/ChessCount"
import Charts from "./containers/Charts/Charts"

class  App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      chessViewers: 0,
      chessColor: "#d1d4dc",
      series: []
    }
    this.webSocket = new WebSocket(window.location.origin.replace(/^http/, 'ws'))
  }

  componentDidMount() {
    console.log(this.webSocket)
    this.webSocket.addEventListener('open', function(event) {
      console.log('Client connected');
    });
    this.webSocket.addEventListener('error', function(error) {
      console.log('Error : ', error);
    });
    this.webSocket.onmessage = (event) => {
      const data = JSON.parse(event.data)
      const [chessViewers] = data.series.filter(serie => serie.name === "Chess")
      const series = data.series.filter(serie => serie.dataType === "live-chart")
      let chessColor
      this.setState((prevState) => {
          if (prevState.chessViewers < chessViewers.data) {
              chessColor = "#26a69a"
          } else if (prevState.chessViewers > chessViewers.data) {
              chessColor = "#f44336"
          } else {
            chessColor = "#d1d4dc"
          }
          return {
            chessViewers: chessViewers.data,
            chessColor: chessColor,
            series: series,
          }
        })
    }
  }

  render() {

    return (
      <div className="App">
        <ChessCount chessViewers={this.state.chessViewers} chessColor={this.state.chessColor} />
        <Charts series={this.state.series} />
      </div>
    );
  }
}

export default App;
