import { useState } from "react";
import styled, { css, withTheme } from "styled-components";
import './App.css';
const gridSize = 4;
const numberList = [2, 4, 8, 16, 32, 64, 128, 256, 512, 1024, 2048, 4096, 8192];
// const defaultArray = Array(gridSize * gridSize).fill(null);
const defaultArray = [0, 0, 0, 2, 2, 2, 4, 2, 0, 0, 0, 0, 2, 0, 0, 2];
const colors = {
  2: { background: '#EBF5EE', color: '#669ca2' },
  4: { background: '#b2cbd5', color: 'white' },
  8: { background: '#526fba', color: 'white' },
  16: { background: '#78a1bb', color: 'white' },
  32: { background: '#bfa89e', color: 'white' },
  64: { background: '#8b786d', color: 'white' },
  128: { background: '#283044', color: 'white' },
  256: { background: '#51669a', color: 'white' },
  512: { background: '#d03862', color: 'white' },
  1024: { background: '#d03862', color: 'white' },
  2048: { background: '#d03862', color: 'white' },
  4096: { background: '#d03862', color: 'white' },
  8192: { background: '#d03862', color: 'white' },
};
function getRandomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min)
}

function getPosition(event) {
  return event._reactName == "onTouchStart" ? { x: event.touches[0].clientX, y: event.touches[0].clientY } :
    (event._reactName == "onTouchMove" || event._reactName == "onTouchEnd") ? { x: event.changedTouches[0].clientX, y: event.changedTouches[0].clientY } : { x: event.clientX, y: event.clientY };
}

function slide(direction, grid) {
  let newArr = [];
  const isUpDown = Math.abs(direction) > 1;
  const max = isUpDown ? gridSize : gridSize * gridSize;
  const addValue = isUpDown ? 1 : gridSize;
  for (let i = 0; i < max; i = i + addValue) {
    let arr = grid.filter((value, index) => {
      return value && (isUpDown ?
        (index % gridSize === i % gridSize) :
        parseInt(index / gridSize) === parseInt(i / gridSize))
    });
    let missing = gridSize - arr.length;
    let zeros = Array(missing).fill(0);
    arr = direction > 0 ? arr.concat(zeros) : zeros.concat(arr); //뒤에서 밀어넣어서 채워짐.와우;
    arr = combineCell(arr, direction > 0 ? 1 : -1);
    newArr = newArr.concat(arr);
  }
  if (Math.abs(direction) > 1) {
    const originArr = [...newArr];
    originArr.map((number, index) => {
      newArr[(index % gridSize) * gridSize + (parseInt(index / gridSize))] = number;
    })
  }
  return newArr;
}

function combineCell(arr, direction) {
  const start = direction > 0 ? 0 : gridSize - 1;
  const end = direction > 0 ? gridSize - 1 : 0;
  for (var i = start; i != end; i = i + direction) {
    if (arr[i + direction]) {
      if (arr[i] === arr[i + direction] && arr[i]) {
        arr[i] = arr[i] * 2;
        arr[i + direction] = 0;
      }
      else if (!arr[i]) {
        arr[i] = arr[i + 1];
        arr[i + direction] = 0;
      }
    }
  }
  return arr;
}

function App() {

  const [numbers, setNumbers] = useState(defaultArray);
  const [score, setscore] = useState(0);
  const [maxNumber, setMaxNumber] = useState(2);
  const [prevPosition, setPrevPosition] = useState({});
  function handleMove() {
    const index = getRandomNumber(0, 3);
    let currentNumbers = [...numbers];
    currentNumbers[0][index] = numberList[index];
    setNumbers(currentNumbers);
  }

  function handleTouchStart(e) {
    const newPosition = getPosition(e);
    setPrevPosition({ ...prevPosition, ...newPosition })
  }

  function getDirection(e) {
    const currentPosition = getPosition(e);
    const xDiff = currentPosition.x - prevPosition.x;
    const yDiff = currentPosition.y - prevPosition.y;
    const xyDiff = Math.abs(xDiff) - Math.abs(yDiff);
    let direction = null;
    if (xyDiff > 0) {
      if (xDiff - 20 > 0) {
        direction = -1;
      }
      else if (xDiff + 20 < 0) {
        direction = 1;
      }
    }
    else if (xyDiff < 0) {
      if (yDiff + 20 < 0) {
        direction = gridSize;
      }
      else if (yDiff - 20 > 0) {
        direction = -gridSize;
      }
    }
    return direction;
  }

  function handleToucheEnd(e) {
    const direction = getDirection(e);
    if (direction) {
      const newArray = slide(direction, [...numbers]);
      setNumbers([...newArray]);
    }
  }

  return (
    <div className="App">
      <Header>
        <Title>2048</Title>
      </Header>
      <Main>
        <Container
          onTouchStart={handleTouchStart}
          // onTouchMove={handleTouchMove}
          onTouchEnd={handleToucheEnd}
        >
          <GridContainer>
            {numbers.map((row, index) =>
              <GridCell key={`cell-${index}`} row={parseInt(index / gridSize)} col={index % gridSize}>
              </GridCell>
            )}
          </GridContainer>
          <TileContainer>
            {numbers.map((number, index) => {
              if (number)
                return <Tile key={`tile-${index}`} number={number} row={parseInt(index / gridSize)} col={index % gridSize}>
                  {number}
                </Tile>
            })}
          </TileContainer>
        </Container>
        <button onClick={handleMove}>추가</button>
      </Main>
    </div >
  );
}

const Header = styled.header`
  background-color: red;
  height : 100px;
  display: flex;
  justify-content: center;
  flex-direction: row;
  align-items: center;
`
const Title = styled.p``;
const Main = styled.main`
  display: flex;
  flex-direction:column;
  align-items: center;
  justify-content: center;
  margin-top: 2rem;
`;


const defaultSize = '18vmin';
const defaultMargin = '2vmin';

const Container = styled.section`
  display: flex;
  flex-direction: row;
  flex-wrap:wrap;
  border-radius: 10px;
  background-color: #67808a;
  padding: ${defaultMargin};
`;

const GridContainer = styled.div`
  display:flex;
  flex-direction: row;
  flex-wrap:wrap;
  ${({ row, col }) => {
    return css`
      width: ${`calc(${defaultSize} * ${gridSize} + ${defaultMargin} * ${gridSize - 1})`};
      height: ${`calc(${defaultSize} * ${gridSize} + ${defaultMargin} * ${gridSize - 1})`};
    `;
  }}
`;
const GridRow = styled.div`
  width: 100%;
  flex: 1;
  border-radius: 6px;
  margin-bottom: ${defaultMargin};
  display: flex;
  flex-direction: row;
  &:last-child{
    margin-bottom: 0;
  }
`;

const Cell = styled.div`
  width : ${defaultSize};
  height: ${defaultSize};
  line-height: ${defaultSize};
  max-width: 140px;
  max-height: 140px;
  border-radius: 3px;
  ${({ row, col }) => {
    return css`
      margin-bottom: ${row < gridSize - 1 ? defaultMargin : 0};
      margin-right: ${col < gridSize - 1 ? defaultMargin : 0};
    `;
  }}
`;
const GridCell = styled(Cell)`
  background-color: #b2cbd5;
`;

const TileContainer = styled.div`
    position: absolute;
    z-index:1;
`;

const Tile = styled(Cell)`
  position: absolute;
  text-align: center;
  font-size: 2em;
  font-weight: bold;
  ${({ number, row, col }) => {
    return css`
      background-color: ${colors[number].background};
      color: ${colors[number].color};
      transform: ${`translate(calc(${col} * ${defaultSize} + ${defaultMargin} * ${col}),calc(${row} * ${defaultSize} + ${defaultMargin} * ${row}))`};
    `
  }}
`;

export default App;
