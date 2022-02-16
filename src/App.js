import { useEffect, useState } from "react";
import styled from "styled-components";
import './App.css';
import { Header, Button, Main, Container, GridContainer, GridCell, TileContainer, Tile, BackGraphic, GameModal } from "./style.js";
const gridSize = 4;
const numberList = [2, 4, 8, 16, 32, 64, 128, 256, 512, 1024, 2048, 4096, 8192];
let count = 0;
const defaultArray = Array(gridSize * gridSize).fill(0);


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

const storedBestScoreKey = '2048_best';
function App() {

  const [numbers, setNumbers] = useState(defaultArray);
  const [beRemovedTiles, setBeRemovedTiles] = useState([]);
  const [score, setscore] = useState(0);
  const [bestScore, setBestScore] = useState(0);
  const [prevPosition, setPrevPosition] = useState({});

  useEffect(() => {
    setInitTile()
    const storedBestScore = localStorage.getItem(storedBestScoreKey);
    if (storedBestScore)
      setBestScore(storedBestScore);
  }, [])

  useEffect(() => {
    if (bestScore < score) {
      setBestScore(score);
      localStorage.setItem(storedBestScoreKey, score);
    }
  }, [score])
  function setInitTile() {
    setBeRemovedTiles([]);
    setscore(0);
    const newTile = getNewTile(numbers, true);
    const newTile2 = getNewTile(numbers, newTile.index);
    if (newTile && newTile2) {
      const newNumbers = [...defaultArray];
      newNumbers[newTile.index] = newTile;
      newNumbers[newTile2.index] = newTile2;
      setNumbers(newNumbers);
    }
  }
  // console.log(numbers)

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
            const addedValue = arr[i].number * 2;
            const changedTile = {
              number: addedValue,
              row: arr[i].row,
              col: arr[i].col,
            }
            resultArray[realIndex] = getTileObject(position, arr[i], changedTile);
            resultArray[realIndex].isCombined = true;
            const { row, col, number } = arr[i + directionValue];
            arr[i + directionValue] = {
              prevRow: row,
              prevCol: col,
              row: position.row,
              col: position.col,
              number
            }
            combinedRowArray.push(arr[i + directionValue]);
            setscore(score => score + addedValue)
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
  // console.log(beRemovedTiles);

  return (
    <div className="App"
      onKeyDown={handleKeyDown}
    >
      <Header score={score} bestScore={bestScore}>
        <Button onClick={setInitTile}>New Game</Button>
      </Header>
      <Main>
        <Container
          onTouchStart={handleTouchStart}
          onTouchEnd={handleToucheEnd}
        >
          <GridContainer gridSize={gridSize}>
            {numbers.map((row, index) =>
              <GridCell key={`cell-${index}`} row={parseInt(index / gridSize)} col={index % gridSize} gridSize={gridSize}>
              </GridCell>
            )}
          </GridContainer>
          <TileContainer>
            {beRemovedTiles.map((tile, index) =>
              <Tile key={`combined-${index}`} tile={tile} beRemoved={true} gridSize={gridSize}>
                {tile.number}
              </Tile>
            )}
            {numbers.map((tile, index) => {
              if (tile)
                return <Tile key={`tile-${index}`} tile={tile} gridSize={gridSize}>
                  {tile.number}
                </Tile>
            })}
          </TileContainer>
        </Container>
      </Main>
      <BackGraphic></BackGraphic>
    </div >
  );
}

export default App;
