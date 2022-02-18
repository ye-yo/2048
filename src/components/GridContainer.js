import styled, { css } from "styled-components";
import { Cell } from "styles/Cell";
import { BOARD_SIZE } from "constants";
const defaultArray = Array(BOARD_SIZE * BOARD_SIZE).fill(0);

export default function GridContainer() {
    return (
        <GridWrap boardSize={BOARD_SIZE}>
            {defaultArray.map((row, index) =>
                <GridCell key={`cell-${index}`} row={parseInt(index / BOARD_SIZE)} col={index % BOARD_SIZE} boardSize={BOARD_SIZE}>
                </GridCell>
            )}
        </GridWrap>
    );
}

const GridWrap = styled.div`
    display:flex;
    flex-direction: row;
    flex-wrap: wrap;
    ${({ boardSize }) => {
        return css`
            width: ${`calc(var(--default_tile_size) * ${boardSize} + var(--default_tile_margin) * ${boardSize - 1})`};
            height: ${`calc(var(--default_tile_size) * ${boardSize} + var(--default_tile_margin) * ${boardSize - 1})`};
        `
    }}
`;

const GridCell = styled(Cell)`
    background-color: #d9e1ff;
`;
