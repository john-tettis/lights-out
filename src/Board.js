import React, { useState } from "react";
import Cell from "./Cell";
import "./Board.css";

/** Game board of Lights out.
 *
 * Properties:
 *
 * - nrows: number of rows of board
 * - ncols: number of cols of board
 * - chanceLightStartsOn: float, chance any cell is lit at start of game
 *
 * State:
 *
 * - board: array-of-arrays of true/false
 *
 *    For this board:
 *       .  .  .
 *       O  O  .     (where . is off, and O is on)
 *       .  .  .
 *
 *    This would be: [[f, f, f], [t, t, f], [f, f, f]]
 *
 *  This should render an HTML table of individual <Cell /> components.
 *
 *  This doesn't handle any clicks --- clicks are on individual cells
 *
 **/

function Board({ nrows=5, ncols=5, chance=0.3 }) {
  const [board, setBoard] = useState(createBoard());

  /** create a board nrows high/ncols wide, each cell randomly lit or unlit */
  function createBoard() {
    let render = (arr)=>{
      for(let i=0;i<ncols;i++){
        arr.push(Math.random()>chance ? false:true)
      }
    }
    let initialBoard =[];
    let solvable = false;
    for(let i=0;i<nrows;i++){
      let arr = []
      render(arr)
      initialBoard.push([...arr])
    }
    while(solvable === false){
      let even = initialBoard.map((row)=>{
        let n = row.reduce((acc,bool)=>{
        return bool ? acc+1:acc
      },0)
      return n
      })
      even.forEach((num,index)=>{
        if(num%2!==0){
          initialBoard[index]=[]
          render(initialBoard[index])
        }
      })
      if(!even.some(num=>num%2!==0)){
        break
      }
    }
   
    // console.log({Board: initialBoard})

    return initialBoard;
  }

  function hasWon() {
  return board.every(row => row.every(cell => !cell));
  
    
  }

  function flipCellsAround(coord) {
    setBoard(oldBoard => {
      const [y, x] = coord.split("-").map(Number);

      const flipCell = (y, x, boardCopy) => {
        // if this coord is actually on board, flip it
        if (x >= 0 && x < ncols && y >= 0 && y < nrows) {
          boardCopy[y][x] = !boardCopy[y][x];
        }
      };
      let board = oldBoard.map(arr=>[...arr])
      let coordinates = [[y,x],[y+1,x],[y-1,x],[y,x+1],[y,x-1]]
      coordinates.forEach(([y,x])=>{
        flipCell(y,x, board)
      })

      return board
    });
  }

  // if the game is won, just show a winning msg & render nothing else
  if(hasWon()){
    return <div className=' Board Board-wins'>You won!</div>
  }
  return (
    <div className="Board">
      <h1 className='Board-title'>Lights Out!</h1>
      <table className="Board-table">
        <tbody>
          {board.map((r,ri)=>(
          <tr>
            {r.map((c,ci)=>{
              let coord=`${ri}-${ci}`
              return( 
              <Cell 
              key={coord}
                flipCellsAroundMe={()=>flipCellsAround(coord)}
                isLit={c}/>)
            }
           
            )}
          </tr>))}
        </tbody>
      </table>
    </div>
  )
}

export default Board;
