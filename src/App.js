import { useEffect, useState } from "react";
import styled, { css, keyframes, withTheme } from "styled-components";
import './App.css';
const gridSize = 4;
const numberList = [2, 4, 8, 16, 32, 64, 128, 256, 512, 1024, 2048, 4096, 8192];
let count = 0;
const defaultArray = Array(gridSize * gridSize).fill(0);
const colors = {
  2: { background: '#F4EEFF', color: '#9186c6' },
  4: { background: '#ccc3f4', color: '#4a3e80' },
  8: { background: '#A6B1E1', color: 'white' },
  16: { background: '#424874', color: 'white' },
  32: { background: '#ffffff', color: '#7596c0' },
  64: { background: '#141E61', color: 'white' },
  128: { background: '#221e39', color: 'white' },
  256: { background: '#5472de', color: 'white' },
  512: { background: '#2e469e', color: 'white' },
  1024: { background: '#e9406d', color: 'white', boxShadow: '0 0 30px 4px rgb(243 116 163 / 48%), inset 0 0 0 1px rgb(255 255 255 / 29%)' },
  2048: { background: '#ffcf62', color: 'white', boxShadow: '0 0 30px 6px rgb(243 215 116 / 48%), inset 0 0 0 1px rgb(255 255 255 / 29%)' },
  4096: { background: '#7de6dc', color: 'white', boxShadow: '0 0 30px 6px rgb(125 230 220 / 48%), inset 0 0 0 1px rgb(255 255 255 / 29%)' },
  8192: { background: 'linear-gradient(45deg, rgb(252, 70, 107), rgb(63, 94, 251))', color: 'white', boxShadow: '0 0 30px 10px rgb(255 255 255 / 48%), inset 0 0 0 1px rgb(255 255 255 / 29%)' },
};

function getRandomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min)
}

function getPosition(event) {
  return event._reactName == "onTouchStart" ? { x: event.touches[0].clientX, y: event.touches[0].clientY } :
    (event._reactName == "onTouchMove" || event._reactName == "onTouchEnd") ? { x: event.changedTouches[0].clientX, y: event.changedTouches[0].clientY } : { x: event.clientX, y: event.clientY };
}

const getRow = (i) => parseInt(i / gridSize);
const getCol = (i) => i % gridSize;



function getTileObject({ row, col }, prev, current) {
  return {
    prevRow: prev.row,
    prevCol: prev.col,
    prevNumber: prev.number,
    row,
    col,
    number: current.number,
  }
}

function isChanged(arr) {
  let changed = false;
  arr.map((tile) => {
    if (tile.prevRow !== tile.row || tile.prevCol !== tile.col || tile.prevNumber !== tile.number) {
      changed = true;
      return false;
    }
  })
  return changed;
}

function getRowAndCol(index) {
  return { row: parseInt(index / gridSize), col: index % gridSize };
}

function App() {

  const [numbers, setNumbers] = useState(defaultArray);
  const [beRemovedTiles, setBeRemovedTiles] = useState([]);
  const [score, setscore] = useState(0);
  const [maxNumber, setMaxNumber] = useState(2);
  const [prevPosition, setPrevPosition] = useState({});

  useEffect(() => {
    const newTile = getNewTile(numbers, true);
    const newTile2 = getNewTile(numbers, newTile.index);
    if (newTile && newTile2) {
      numbers[newTile.index] = newTile;
      numbers[newTile2.index] = newTile2;
      setNumbers([...numbers]);
    }
  }, [])

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    }
  }, [handleKeyDown])

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
      if (xDiff + 20 < 0) {//left
        direction = 1;
      }
      else if (xDiff - 20 > 0) { //right
        direction = -1;
      }
    }
    else if (xyDiff < 0) {
      if (yDiff + 20 < 0) { //up
        direction = gridSize;
      }
      else if (yDiff - 20 > 0) { //down
        direction = -gridSize;
      }
    }
    return direction;
  }

  function handleToucheEnd(e) {
    const direction = getDirection(e);
    slideNumbers(direction);
  }

  function slideNumbers(direction) {
    if (direction) {
      let { newArray, combinedArray } = slide(direction, [...numbers]);
      if (isChanged(newArray)) {
        const newTile = getNewTile(newArray);
        if (newTile) {
          newArray[newTile.index] = newTile;
          setNumbers([...newArray]);
          setBeRemovedTiles([...combinedArray]);
        }
      }
    }
  }

  function getNewTile(arr, isInit = null) {
    let emptyPosition = [];
    arr.map((number, index) => {
      if (!number && (isInit !== index))
        emptyPosition.push(index);
    })
    if (emptyPosition) {
      const index = emptyPosition[getRandomNumber(0, emptyPosition.length - 1)];
      const number = numberList[isInit !== null ? 0 : getRandomNumber(0, 1)];
      const { row, col } = getRowAndCol(index);
      return {
        index, number, prevNumber: number, row, col, prevRow: row, prevCol: col, isNew: true,
      }
    }
    else {
      return false;
    }
  }

  function handleKeyDown(e) {
    let direction = null;
    switch (e.keyCode) {
      case 37: direction = 1; break;
      case 38: direction = 4; break;
      case 39: direction = -1; break;
      case 40: direction = -4; break;
      default: break;
    }
    slideNumbers(direction);
  }
  // console.log(numbers);
  function slide(direction, grid) {
    let newArr = Array(gridSize * gridSize).fill(0);
    const isUpDown = Math.abs(direction) > 1;
    const max = isUpDown ? gridSize : gridSize * gridSize;
    const addValue = isUpDown ? 1 : gridSize;
    let combinedArray = [];
    for (let i = 0; i < max; i = i + addValue) {
      let arr = grid.filter((tile, index) => {
        return tile.number && (isUpDown ?
          (index % gridSize === i % gridSize) :
          parseInt(index / gridSize) === parseInt(i / gridSize))
      });
      let missing = gridSize - arr.length;
      let zeros = Array(missing).fill(0);
      arr = direction > 0 ? arr.concat(zeros) : zeros.concat(arr);
      if (zeros.length < gridSize) {
        const rootIndex = isUpDown ? getCol(i) : getRow(i);
        const { movedArray, combinedRowArray } = combineCell(arr, newArr, direction, rootIndex);
        newArr = movedArray;
        combinedArray = combinedRowArray;
      }
      // console.log(newArr)
    }
    return { newArray: newArr, combinedArray };
  }
  function combineCell(arr, resultArray, direction, rootIndex) {
    let combinedRowArray = [];
    const isUpDown = Math.abs(direction) > 1,
      directionValue = direction > 0 ? 1 : -1,
      start = directionValue > 0 ? 0 : gridSize - 1,
      end = directionValue > 0 ? gridSize : -1;
    for (var i = start; i !== end; i = i + directionValue) {
      const position = { row: isUpDown ? i : rootIndex, col: isUpDown ? rootIndex : i };
      const realIndex = position.row * gridSize + position.col;
      if (i + directionValue !== end) {
        if (arr[i + directionValue]) {
          if (arr[i].number === arr[i + directionValue].number && arr[i].number) {
            const changedTile = {
              number: arr[i].number * 2,
              row: arr[i].row,
              col: arr[i].col,
            }
            resultArray[realIndex] = getTileObject(position, arr[i], changedTile);
            resultArray[realIndex].isCombined = true;
            console.log("combined", beRemovedTiles);
            const { row, col, number } = arr[i + directionValue];
            arr[i + directionValue] = {
              prevRow: row,
              prevCol: col,
              row: position.row,
              col: position.col,
              number
            }
            combinedRowArray.push(arr[i + directionValue]);
            arr.splice(i + directionValue, 1)
            direction > 0 ? arr.push(0) : arr.unshift(0);
            continue;
          }
          else if (!arr[i]) {
            resultArray[realIndex] = getTileObject(position, arr[i + directionValue], arr[i + directionValue]);
            arr.splice(i + directionValue, 1)
            direction > 0 ? arr.push(0) : arr.unshift(0);
            continue;
          }
        }
      }
      if (arr[i]) {
        resultArray[realIndex] = getTileObject(position, arr[i], arr[i])
      }
    }
    return { movedArray: resultArray, combinedRowArray };
  }
  console.log(beRemovedTiles);

  // console.log(beRemovedTiles)
  return (
    <div className="App"
      onKeyDown={handleKeyDown}
    >
      <Header>
        <Title>2048</Title>
      </Header>
      <Main>
        <Container
          onTouchStart={handleTouchStart}
          onTouchEnd={handleToucheEnd}
        >
          <GridContainer>
            {numbers.map((row, index) =>
              <GridCell key={`cell-${index}`} row={parseInt(index / gridSize)} col={index % gridSize}>
              </GridCell>
            )}
          </GridContainer>
          <TileContainer>
            {beRemovedTiles.map((tile, index) =>
              <Tile key={`combined-${index}`} tile={tile} beRemoved={true}>
                {tile.number}
              </Tile>
            )}
            {numbers.map((tile, index) => {
              if (tile)
                return <Tile key={`tile-${index}`} tile={tile}>
                  {tile.number}
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
  width: ${`calc(${defaultSize} * ${gridSize} + ${defaultMargin} * ${gridSize - 1})`};
  height: ${`calc(${defaultSize} * ${gridSize} + ${defaultMargin} * ${gridSize - 1})`};
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
  ${({ tile, beRemoved }) => {
    if (tile) {
      const { number, row, col, prevCol, prevRow, prevNumber, isNew, isCombined } = tile;
      const position = {
        x: `calc(${col} * ${defaultSize} + ${defaultMargin} * ${col})`,
        y: `calc(${row} * ${defaultSize} + ${defaultMargin} * ${row})`,
        prevX: `calc(${prevCol} * ${defaultSize} + ${defaultMargin} * ${prevCol})`,
        prevY: `calc(${prevRow} * ${defaultSize} + ${defaultMargin} * ${prevRow})`
      }
      return css`
        background: ${colors[number].background};
        color: ${colors[number].color};
        box-shadow: ${colors[number].boxShadow || 'none'};
        transform: ${`translate(${position.prevX},${position.prevY})`};
        opacity: ${isNew ? 0 : 1};
        animation-duration : ${isCombined ? '.4s' : '.4s'};
        animation-delay: ${isNew ? '.4s' : 'none'};
        animation-timing-function: ease;
        animation-fill-mode: forwards;
        animation-name: ${isNew ? scaleUp(position) : isCombined ? pop(position) : beRemoved ? slideOutTile(position) : slideTile(position)};
        z-index: ${(isNew || isCombined) ? 1 : 0};
      `
    }
  }}
`;

const pop = ({ x, y }) => keyframes`
   from{
      transform: ${`translate(${x},${y})`} scale(0);
    }
    80%{
      transform: ${`translate(${x},${y})`} scale(1.2);
    }
    to{
      transform: ${`translate(${x},${y})`} scale(1);
    }
`

const slideTile = ({ prevX, x, prevY, y }) => keyframes`
  from {
    transform: ${`translate(${prevX},${prevY})`};
  }
  to{
    transform : ${`translate(${x},${y})`};
  }
`

const slideOutTile = ({ prevX, x, prevY, y }) => keyframes`
  from {
    transform: ${`translate(${prevX},${prevY})`};
  }
  to{
    transform : ${`translate(${x},${y})`};
    display: none;
  }
`

const scaleUp = ({ x, y }) => keyframes`
  from {
    transform: ${`translate(${x},${y})`} scale(0);
  }
  to{
    opacity: 1;
  }
`
export default App;
