import styled, { css, keyframes } from "styled-components";
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

export const Header = styled.header`
background-color: red;
height : 100px;
display: flex;
justify-content: center;
flex-direction: row;
align-items: center;
`
export const Title = styled.p``;
export const Main = styled.main`
display: flex;
flex-direction:column;
align-items: center;
justify-content: center;
margin-top: 2rem;
`;


const defaultSize = '18vmin';
const defaultMargin = '2vmin';

export const Container = styled.section`
display: flex;
flex-direction: row;
flex-wrap:wrap;
border-radius: 10px;
background-color: #67808a;
padding: ${defaultMargin};
`;

export const GridContainer = styled.div`
display:flex;
flex-direction: row;
flex-wrap:wrap;
${({ gridSize }) => {
        return css`
            width: ${`calc(${defaultSize} * ${gridSize} + ${defaultMargin} * ${gridSize - 1})`};
            height: ${`calc(${defaultSize} * ${gridSize} + ${defaultMargin} * ${gridSize - 1})`};
        `
    }}
`;
export const GridRow = styled.div`
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

export const Cell = styled.div`
width : ${defaultSize};
height: ${defaultSize};
line-height: ${defaultSize};
max-width: 140px;
max-height: 140px;
border-radius: 3px;
${({ row, col, gridSize }) => {
        return css`
    margin-bottom: ${row < gridSize - 1 ? defaultMargin : 0};
    margin-right: ${col < gridSize - 1 ? defaultMargin : 0};
  `;
    }}
`;
export const GridCell = styled(Cell)`
background-color: #b2cbd5;
`;

export const TileContainer = styled.div`
  position: absolute;
  z-index:1;
`;

export const Tile = styled(Cell)`
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