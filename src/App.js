import { useState } from "react";
import testUtils from "react-dom/test-utils";
import styled, { css, withTheme } from "styled-components";
import './App.css';
const numberList = [2, 4, 8, 16, 32, 64, 128, 256, 512, 1024, 2048, 4096, 8192];
const defaultArray = Array(4).fill(null).map(() => new Array(4).fill(2));
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

function App() {

  const [numbers, setNumbers] = useState(defaultArray);
  const [score, setscore] = useState(0);
  const [maxNumber, setMaxNumber] = useState(2);
  function handleMove() {
    const index = getRandomNumber(0, 3);
    let currentNumbers = [...numbers];
    currentNumbers[0][index] = numberList[index];
    setNumbers(currentNumbers);
  }

  function getEmptyPosition() {

  }

  return (
    <div className="App">
      <Header>
        <Title>2048</Title>
      </Header>
      <Main>
        <Container>
          <GridContainer>
            {numbers.map((row, rowIndex) =>
              <GridRow key={`grid-${rowIndex}`}>
                {row.map((number, colIndex) =>
                  <GridCell key={`${rowIndex}x${colIndex}`}>
                  </GridCell>
                )}
              </GridRow>
            )}
          </GridContainer>
          <TileContainer>
            {numbers.map((row, rowIndex) =>
              row.map((number, colIndex) =>
                number &&
                <Tile key={`tile-${colIndex}`} number={number} row={rowIndex} col={colIndex}>
                  {number}
                </Tile>
              )
            )}
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
  width: fit-content;
  height: fit-content;
`;
const GridRow = styled.div`
  width: 100%;
  width: fit-content;
  height: fit-content;
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
`;
const GridCell = styled(Cell)`
  margin-right: ${defaultMargin};
  background-color: #b2cbd5;
  &:last-child{
    margin-right: 0;
  }
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
    console.log(number)
    return css`
      background-color: ${colors[number].background};
      color: ${colors[number].color};
      transform: ${`translate(calc(${col} * ${defaultSize} + ${defaultMargin} * ${col}),calc(${row} * ${defaultSize} + ${defaultMargin} * ${row}))`};
    `
  }}
`;

export default App;
