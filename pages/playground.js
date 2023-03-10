import Head from 'next/head'
import { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';


export default function Home(props) {

  const [windowSize, setWindowSize] = useState({
    x: 0,
    y: 0
  });
  const [ squareGrid, setSquareGrid ] = useState([]);

  const getRandomInt = (min, max) => {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  // const colors = [
  //   'blue',
  //   'red',
  //   'green',
  //   'yellow',
  //   'purple'
  // ];

  const colors = [
    'black',
    'gray',
    'lightgray',
    'darkgray',
  ];

  class Square {
    constructor(x, y) {
      this.background = colors[getRandomInt(0, colors.length - 1)];
      this.position = {
        x: x,
        y: y
      }
    }
  };

  const onWindowResize = () => {
    setWindowSize({
      x: window.innerWidth,
      y: window.innerHeight
    });
  }

  useEffect(() => {
    setWindowSize({
      x: window.innerWidth,
      y: window.innerHeight
    });

    window.addEventListener('resize', onWindowResize);

    return (() => {
      window.removeEventListener('resize', onWindowResize);
    })
  }, []);

  const totalColumns = 20;

  useEffect(() => {
    // console.log(windowSize.x / 20);
    let newSquareGrid = [];
    let rowCount = 1;
    let squareWidth = windowSize.x / totalColumns;
    let totalRows = Math.ceil(windowSize.y / squareWidth);

    console.log(totalRows);

    
    for (let i = 1; i <= totalRows; i++) {
      newSquareGrid.push(new Array());
      for (let i = 1; i <= totalColumns; i++) {
        if (i % totalColumns === 0) {
          newSquareGrid[rowCount - 1].push(new Square(i, rowCount));
          rowCount += 1;
        } else {
          newSquareGrid[rowCount - 1].push(new Square(i, rowCount));
        }
    }

    };

    setSquareGrid(newSquareGrid);
  }, [windowSize]);

  useEffect(() => {
    console.log(squareGrid);
  }, [squareGrid]);

  const onSquareClick = (square) => {
    console.log(square);
    let selectedX = square.position.x;
    let selectedY = square.position.y;

    let surroundingSquares = [
      [squareGrid[selectedY - 2][selectedX - 2]]
    ];
    
    console.log(surroundingSquares)
  }

  return (
    <StyledMain>
      {squareGrid.map((squareRow, index) => (
        <>
          {squareRow.map((square, index) => (
            <StyledSquare
              key={index} 
              onClick={() => {
                onSquareClick(square)
              }}
              totalColumns={totalColumns}
              className="square" 
              background={square.background}
              position={{
                x: square.position.x,
                y: square.position.y
              }}
            />
          ))}
        </>
      ))}
    </StyledMain>
  )
}

const StyledMain = styled.main`
  width: 100vw;
  height: 100vh;
  overflow: hidden;
`;

const StyledSquare = styled.div`
  position: absolute;
  width: calc(100vw / ${props => props.totalColumns});
  height: calc(100vw / ${props => props.totalColumns});
  /* box-shadow: 0 0 1px 1px black; */
  /* border: 1px solid black; */
  font-size: ${props => props.position.x}px;
  background: ${props => props.background};
  transform: 
    translateX(calc(${(props) => props.position.x - 1} * (100vw / ${props => props.totalColumns})))
    translateY(calc(${(props) => props.position.y - 1} * (100vw / ${props => props.totalColumns})));
`;