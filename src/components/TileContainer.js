import styled, { css, keyframes } from "styled-components";
import { BOARD_SIZE } from "constants";
import { Cell } from "styles/Cell";
export default function TileContainer({ numbers, beRemovedTiles }) {
  return (
    <TileWrap>
      {beRemovedTiles.map((tile, index) =>
        <Tile key={`combined-${index}`} tile={tile} beRemoved={true} boardSize={BOARD_SIZE}>
          {tile.number}
        </Tile>
      )}
      {numbers.map((tile, index) =>
        tile ?
          <Tile key={`tile-${tile.id}`} tile={tile} boardSize={BOARD_SIZE}>
            {tile.number}
          </Tile> : ''
      )}
    </TileWrap>
  );
}

const TileWrap = styled.div`
  position: absolute;
  z-index:1;
`;

const colors = {
  2: { background: '#F4EEFF', color: '#9186c6' },
  4: { background: '#ccc3f4', color: '#4a3e80' },
  8: { background: '#A6B1E1', color: 'white' },
  16: { background: '#424874', color: 'white' },
  32: { background: '#ffffff', color: '#7582c0' },
  64: { background: '#141E61', color: 'white' },
  128: { background: '#221e39', color: 'white' },
  256: { background: '#5472de', color: 'white' },
  512: { background: '#2e469e', color: 'white' },
  1024: { background: '#e9406d', color: 'white', boxShadow: '0 0 30px 4px rgb(243 116 163 / 48%), inset 0 0 0 1px rgb(255 255 255 / 29%)' },
  2048: { background: '#ffcf62', color: 'white', boxShadow: '0 0 30px 6px rgb(243 215 116 / 48%), inset 0 0 0 1px rgb(255 255 255 / 29%)' },
  4096: { background: '#7de6dc', color: 'white', boxShadow: '0 0 30px 6px rgb(125 230 220 / 48%), inset 0 0 0 1px rgb(255 255 255 / 29%)' },
  8192: { background: 'linear-gradient(45deg, rgb(252, 70, 107), rgb(63, 94, 251))', color: 'white', boxShadow: '0 0 30px 10px rgb(255 255 255 / 48%), inset 0 0 0 1px rgb(255 255 255 / 29%)' },
};

const Tile = styled(Cell).attrs(({ tile }) => {
  if (tile) {
    const { number } = tile;
    return ({
      style: {
        background: colors[number].background,
        color: colors[number].color,
        boxShadow: colors[number].boxShadow || 'none',
      }
    })
  }
})`
    ${({ tile, beRemoved }) => {
    if (tile) {
      const { row, col, prevCol, prevRow, isNew, isCombined } = tile;
      const position = {
        x: `calc(${col} * var(--default_tile_size) + var(--default_tile_margin) * ${col})`,
        y: `calc(${row} * var(--default_tile_size) + var(--default_tile_margin) * ${row})`,
        prevRow: `calc(${prevCol} * var(--default_tile_size) + var(--default_tile_margin) * ${prevCol})`,
        prevCol: `calc(${prevRow} * var(--default_tile_size) + var(--default_tile_margin) * ${prevRow})`
      }
      return css`
                transform: ${`translate(${position.prevRow},${position.prevCol})`};
                opacity: ${isNew ? 0 : 1};
                animation-duration: ${(isCombined || isNew) ? '.2s' : '.1s'};
                animation-delay: ${isNew ? '.2s' : 'none'};
                animation-timing-function: ease-in;
                animation-fill-mode: forwards;
                z-index: ${(isNew || isCombined) ? 0 : 0};
                animation-name: ${isNew ? scaleUp(position)
          : isCombined ? pop(position)
            : beRemoved ? slideOutTile(position) : slideTile(position)};
            `
    }
  }}
    position: absolute;
    text-align: center;
    font-size: 4.4rem;
    font-weight: bold;
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

const slideTile = ({ prevRow, x, prevCol, y }) => keyframes`
  from {
    transform: ${`translate(${prevRow},${prevCol})`};
  }
  to{
    transform : ${`translate(${x},${y})`};
  }
`

const slideOutTile = ({ prevRow, x, prevCol, y }) => keyframes`
  from {
    transform: ${`translate(${prevRow},${prevCol})`};
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
    transform: ${`translate(${x},${y})`} scale(1);
    opacity: 1;
  }
`