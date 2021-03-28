import React from 'react'
import "./ChessCount.scss"
 
const chessCount = (props) => (

  <div className={"chessCount"}>
    <div className={"chessCountTitle rainbowTextAnimated"}> TOTAL CHESS VIEWERS</div>
    <div className={"chessCountNumber"} style={{color:props.chessColor}} > {props.chessViewers} </div>
  </div>
)

export default chessCount