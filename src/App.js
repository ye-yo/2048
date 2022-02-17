import { useCallback, useEffect, useState } from "react";
import './App.css';
import { Header, Button, Main, Container, GridContainer, GridCell, TileContainer, Tile, GameModal } from "./style.js";
const BOARD_SIZE = 4;
const numberList = [2, 4, 8, 16, 32, 64, 128, 256, 512, 1024, 2048, 4096, 8192];
const defaultArray = Array(BOARD_SIZE * BOARD_SIZE).fill(0);
const WIN_NUMBER = 2048;
const MAX_NUMBER = 8192;

function getRandomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min)
}

function getPosition(event) {
  return event._reactName === "onTouchStart" ? { x: event.touches[0].clientX, y: event.touches[0].clientY } :
    (event._reactName === "onTouchMove" || event._reactName === "onTouchEnd") ? { x: event.changedTouches[0].clientX, y: event.changedTouches[0].clientY } : { x: event.clientX, y: event.clientY };
}

const getRow = (i) => parseInt(i / BOARD_SIZE);
const getCol = (i) => i % BOARD_SIZE;

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

function isTileChanged({ prevRow, row, prevCol, col, prevNumber, number }) {
  return prevRow !== row || prevCol !== col || prevNumber !== number;
}
function isChanged(arr) {
  let changed = arr.some(isTileChanged);
  return changed;
}

function getRowAndCol(index) {
  return { row: parseInt(index / BOARD_SIZE), col: index % BOARD_SIZE };
}

const storedBestScoreKey = '2048_best';
function App() {

  const [numbers, setNumbers] = useState(defaultArray);
  const [beRemovedTiles, setBeRemovedTiles] = useState([]);
  const [score, setScore] = useState(0);
  const [bestScore, setBestScore] = useState(0);
  const [prevPosition, setPrevPosition] = useState({});
  const [gameModal, setGameModal] = useState(null);

  const setInitTile = useCallback(() => {
    setBeRemovedTiles([]);
    setScore(0);
    setGameState(1);
    const newTile = getNewTile(defaultArray, true);
    const newTile2 = getNewTile(defaultArray, newTile.index);
    if (newTile && newTile2) {
      const newNumbers = [...defaultArray];
      newNumbers[newTile.index] = newTile;
      newNumbers[newTile2.index] = newTile2;
      setNumbers(newNumbers);
    }
  }, []);

  useEffect(() => {
    setInitTile()
    const storedBestScore = localStorage.getItem(storedBestScoreKey);
    if (storedBestScore)
      setBestScore(storedBestScore);
  }, [setInitTile])

  useEffect(() => {
    if (bestScore < score) {
      setBestScore(score);
      localStorage.setItem(storedBestScoreKey, score);
    }
  }, [score])

  const setGameState = useCallback((gameState) => {
    if (gameState !== 1) {
      let message = 'You Win!';
      let button = <button className="btn-continue" onClick={() => setGameModal(null)}>Continue</button>;
      switch (gameState) {
        case 0:
          message = 'Game Over!';
          button = <button className="btn-lose" onClick={setInitTile}>Try again</button>;
          break;
        case 8192:
          message = 'You Win!';
          button = <button className="btn-new-game" onClick={setInitTile}>New Game</button>;
          break;
        default: break;
      }
      setGameModal({ message, button });
    }
    else setGameModal(null);
  }, [setInitTile]);

  function checkIsCombinable() {
    return numbers.some((tile, i) => {
      const checkRow = i % BOARD_SIZE !== BOARD_SIZE - 1 && numbers[i + 1] && (numbers[i + 1].number === tile.number);
      const checkColumn = numbers[i + BOARD_SIZE] && (numbers[i + BOARD_SIZE].number === tile.number);
      return checkRow || checkColumn;
    });
  }

  function checkBoardIsFull() {
    return !numbers.some(tile => !tile);
  }

  function getMaxNumber() {
    return Math.max.apply(Math, numbers.map(tile => tile.number || 0));
  }

  function getGameState() {
    const isBoardFull = checkBoardIsFull();
    const maxNumber = getMaxNumber();
    const isCombinable = checkIsCombinable();
    return { maxNumber, isBoardFull, isCombinable };
  }

  useEffect(() => {
    const { maxNumber, isBoardFull, isCombinable } = getGameState();
    if (!isCombinable && isBoardFull) {
      setGameState(0);
    }
    else if (!isBoardFull && (maxNumber === WIN_NUMBER || maxNumber === MAX_NUMBER)) {
      setGameState(maxNumber);
    }
  }, [numbers, setGameState])

  const slideNumbers = useCallback(direction => {
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
  }, [numbers, slide]);

  useEffect(() => {
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
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [slideNumbers]);

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
        direction = BOARD_SIZE;
      }
      else if (yDiff - 20 > 0) { //down
        direction = -BOARD_SIZE;
      }
    }
    return direction;
  }

  function handleToucheEnd(e) {
    const direction = getDirection(e);
    slideNumbers(direction);
  }

  function getEmptyPosition(arr, isInit) {
    return arr.reduce((accumulator, number, index) => !number && (isInit !== index) ? (accumulator.push(index), accumulator) : accumulator, []);
  }
  function getNewTile(arr, isInit = null) {
    let emptyPosition = getEmptyPosition(arr, isInit);
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
  // console.log(numbers);
  function slide(direction, grid) {
    let newArr = Array(BOARD_SIZE * BOARD_SIZE).fill(0);
    const isUpDown = Math.abs(direction) > 1;
    const max = isUpDown ? BOARD_SIZE : BOARD_SIZE * BOARD_SIZE;
    const addValue = isUpDown ? 1 : BOARD_SIZE;
    let combinedArray = [];
    for (let i = 0; i < max; i = i + addValue) {
      let arr = grid.filter((tile, index) => {
        return tile.number && (isUpDown ?
          (index % BOARD_SIZE === i % BOARD_SIZE) :
          parseInt(index / BOARD_SIZE) === parseInt(i / BOARD_SIZE))
      });
      let missing = BOARD_SIZE - arr.length;
      let zeros = Array(missing).fill(0);
      arr = direction > 0 ? arr.concat(zeros) : zeros.concat(arr);
      if (zeros.length < BOARD_SIZE) {
        const rootIndex = isUpDown ? getCol(i) : getRow(i);
        const { movedArray, combinedRowArray } = combineCell({ arr, resultArray: newArr, direction, rootIndex });
        newArr = movedArray;
        combinedArray = combinedRowArray;
      }
      // console.log(newArr)
    }
    return { newArray: newArr, combinedArray };
  }
  function combineCell({ arr, resultArray, direction, rootIndex }) {
    let combinedRowArray = [];
    const isUpDown = Math.abs(direction) > 1,
      directionValue = direction > 0 ? 1 : -1,
      start = directionValue > 0 ? 0 : BOARD_SIZE - 1,
      end = directionValue > 0 ? BOARD_SIZE : -1;
    for (var i = start; i !== end; i = i + directionValue) {
      const position = { row: isUpDown ? i : rootIndex, col: isUpDown ? rootIndex : i };
      const realIndex = position.row * BOARD_SIZE + position.col;
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
            setScore(score => score + addedValue)
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
    <div className="App">
      <Header score={score} bestScore={bestScore}>
        <Button onClick={setInitTile}>New Game</Button>
      </Header>
      <Main>
        <Container
          onTouchStart={handleTouchStart}
          onTouchEnd={handleToucheEnd}
        >
          {gameModal && <GameModal gameModal={gameModal} />}
          <GridContainer boardSize={BOARD_SIZE}>
            {numbers.map((row, index) =>
              <GridCell key={`cell-${index}`} row={parseInt(index / BOARD_SIZE)} col={index % BOARD_SIZE} boardSize={BOARD_SIZE}>
              </GridCell>
            )}
          </GridContainer>
          <TileContainer>
            {beRemovedTiles.map((tile, index) =>
              <Tile key={`combined-${index}`} tile={tile} beRemoved={true} boardSize={BOARD_SIZE}>
                {tile.number}
              </Tile>
            )}
            {numbers.map((tile, index) =>
              tile ?
                <Tile key={`tile-${index}`} tile={tile} boardSize={BOARD_SIZE}>
                  {tile.number}
                </Tile> : ''
            )}
          </TileContainer>
        </Container>
      </Main>
    </div >
  );
}

export default App;
