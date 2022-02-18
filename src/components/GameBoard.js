import React, { useState, useEffect, useCallback } from "react";
import styled from "styled-components";
import { GameModal, GridContainer } from 'components';
import { BOARD_SIZE, WIN_NUMBER, MAX_NUMBER, BEST_SCORE_KEY } from "constants";
import TileContainer from "./TileContainer";
import { getDirection, getPosition } from 'utils/touchEvent';
import { getRow, getColumn, getNewTile, isChanged, checkAllValueIsTrue, combineTile, checkIsCombinable } from 'utils/tile';
const defaultArray = Array(BOARD_SIZE * BOARD_SIZE).fill(0);

function getMaxNumber(numbers) {
    return Math.max.apply(Math, numbers.map(tile => tile.number || 0));
}
export default function GameBoard({ setScore, setBestScore }) {
    const [gameModal, setGameModal] = useState(null);
    const [numbers, setNumbers] = useState(defaultArray);
    const [prevPosition, setPrevPosition] = useState({});

    const slideTiles = useCallback((direction) => {
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
    }, [slide]);

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


    useEffect(() => {
        setInitTile()
        const storedBestScore = localStorage.getItem(BEST_SCORE_KEY);
        if (storedBestScore)
            setBestScore(storedBestScore);
    }, [])


    useEffect(() => {
        const { maxNumber, isBoardFull, isCombinable } = getGameState();
        if (!isCombinable && isBoardFull) {
            setGameState(0);
        }
        else if (!isBoardFull && (maxNumber === WIN_NUMBER || maxNumber === MAX_NUMBER)) {
            setGameState(maxNumber);
        }
    }, [numbers])

    function setInitTile() {
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
    }

    function setGameState(gameState) {
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
    }

    function getGameState() {
        const isBoardFull = checkAllValueIsTrue(numbers);
        const maxNumber = getMaxNumber(numbers);
        const isCombinable = checkIsCombinable(numbers);
        return { maxNumber, isBoardFull, isCombinable };
    }

    const [beRemovedTiles, setBeRemovedTiles] = useState([]);

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

    function handleTouchStart(e) {
        const newPosition = getPosition(e);
        setPrevPosition({ ...prevPosition, ...newPosition })
    }

    function handleToucheEnd(e) {
        const direction = getDirection(e, prevPosition);
        if (direction)
            slideTiles(direction);
    }

    return (
        <Container
            onTouchStart={handleTouchStart}
            onTouchEnd={handleToucheEnd}
        >
            {gameModal && <GameModal gameModal={gameModal} />}
            <GridContainer />
            <TileContainer numbers={numbers} beRemovedTiles={beRemovedTiles} />
        </Container>
    );
}

const Container = styled.section`
    display: flex;
    flex-direction: row;
    flex-wrap:wrap;
    border-radius: 10px;
    background-color: #8796ce;
    padding: var(--default_tile_margin);
    position: relative;
    overflow: hidden;
`;





