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
const getColumn = (i) => i % BOARD_SIZE;

function getRowAndCol(index) {
  return { row: getRow(index), col: getColumn(index) };
}

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

function checkTileChanged({ prevRow, row, prevCol, col, prevNumber, number }) {
  return prevRow !== row || prevCol !== col || prevNumber !== number;
}

function isChanged(arr) {
  let changed = arr.some(checkTileChanged);
  return changed;
}

function checkAllValueIsTrue(array) {
  return !array.some(tile => !tile);
}

function getMaxNumber(numbers) {
  return Math.max.apply(Math, numbers.map(tile => tile.number || 0));
}

function getEmptyPosition(arr, isInit) {
  return arr.reduce((accumulator, number, index) => !number && (isInit !== index) ? (accumulator.push(index), accumulator) : accumulator, []);
}

function getDirection(e, prevPosition) {
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

function compareAWithBNumber(a, b) {
  return a.number === b.number;
}

function getLoopCondition(direction) {
  const directionValue = direction > 0 ? 1 : -1;
  return {
    directionValue,
    start: directionValue > 0 ? 0 : BOARD_SIZE - 1,
    end: directionValue > 0 ? BOARD_SIZE : -1
  }
}

function getRemovedTile(tile, destinationTile) {
  const { row, col, number } = tile;
  tile = {
    prevRow: row,
    prevCol: col,
    row: destinationTile.row,
    col: destinationTile.col,
    number
  }
  return tile;
}

function pushToEnd(line, targetIndex, direction) {
  const array = [...line];
  array.splice(targetIndex, 1)
  direction > 0 ? array.push(0) : array.unshift(0);
  return array;
}

const storedBestScoreKey = '2048_best';


function combineTile({ line, isUpDown, resultArray, direction, rootIndex }) {
  let combinedRowArray = [];
  let interimScore = 0;
  const { directionValue, start, end } = getLoopCondition(direction);
  for (var i = start; i !== end; i = i + directionValue) {
    const position = { row: isUpDown ? i : rootIndex, col: isUpDown ? rootIndex : i };
    const realIndex = position.row * BOARD_SIZE + position.col;
    const nextIndex = i + directionValue;
    let current = line[i];
    const next = line[nextIndex];
    if (current) {
      current = getTileObject(position, current, current)
      if (next) {
        if (compareAWithBNumber(current, next)) {
          const { combinedTile, removedTile, addedValue } = combineAToB(next, current)
          interimScore += addedValue;
          resultArray[realIndex] = combinedTile;
          combinedRowArray.push(removedTile);
          line = pushToEnd(line, nextIndex, direction);
          continue;
        }
      }
      resultArray[realIndex] = current;
    }
    else if (next) {
      resultArray[realIndex] = getTileObject(position, next, next);
      line = pushToEnd(line, nextIndex, direction);
      continue;
    }
  }
  return { movedArray: resultArray, combinedRowArray, interimScore };
}


function combineAToB(a, b) {
  const addedValue = b.number * 2;
  b.prevNumber = b.number;
  b.number = addedValue;
  b.isCombined = true;
  const removedTile = getRemovedTile(a, b);
  return { combinedTile: b, removedTile, addedValue };
}



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

  function getGameState() {
    const isBoardFull = checkAllValueIsTrue(numbers);
    const maxNumber = getMaxNumber(numbers);
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

  const slideTiles = useCallback(direction => {
    let { newArray, combinedArray, totalAddedScore } = slide(direction, [...numbers]);
    if (isChanged(newArray)) {
      const newTile = getNewTile(newArray);
      if (newTile) {
        newArray[newTile.index] = newTile;
        setScore(score => score + totalAddedScore)
        setNumbers([...newArray]);
        setBeRemovedTiles([...combinedArray]);
      }
    }
  }, [numbers, slide]);

  useEffect(() => {
    function handleKeyDown(e) {
      let direction = null;
      switch (e.keyCode) {
        case 37: direction = 1; break;
        case 38: direction = BOARD_SIZE; break;
        case 39: direction = -1; break;
        case 40: direction = -BOARD_SIZE; break;
        default: break;
      }
      if (direction)
        slideTiles(direction);
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [slideTiles]);

  function handleTouchStart(e) {
    const newPosition = getPosition(e);
    setPrevPosition({ ...prevPosition, ...newPosition })
  }

  function handleToucheEnd(e) {
    const direction = getDirection(e, prevPosition);
    if (direction)
      slideTiles(direction);
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
    else return false;
  }

  function getLine({ row, col }, isUpDown) {
    return numbers.filter((tile, index) => tile.number && (isUpDown ? getColumn(index) === col : getRow(index) === row));
  }

  function slide(direction) {
    let newArray = Array(BOARD_SIZE * BOARD_SIZE).fill(0);
    const isUpDown = Math.abs(direction) > 1;
    let combinedArray = [];
    let totalAddedScore = 0;
    for (var index = 0; index < BOARD_SIZE; index++) {
      const basePosition = isUpDown ? { row: 0, col: index } : { row: getRow(index * BOARD_SIZE), col: 0 };
      let line = getLine(basePosition, isUpDown);
      const missing = BOARD_SIZE - line.length;
      const zeros = Array(missing).fill(0);
      line = direction > 0 ? line.concat(zeros) : zeros.concat(line);
      if (zeros.length < BOARD_SIZE) {
        const rootIndex = isUpDown ? basePosition.col : basePosition.row;
        const { movedArray, combinedRowArray, interimScore } = combineTile({ line, isUpDown, resultArray: newArray, direction, rootIndex });
        totalAddedScore += interimScore;
        newArray = movedArray;
        combinedArray = combinedRowArray;
      }
    }
    return { newArray, combinedArray, totalAddedScore };
  }

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
