import styled from "styled-components";

export const Cell = styled.div(({ row, col, boardSize }) => ({
    width: 'var(--default_tile_size)',
    height: 'var(--default_tile_size)',
    lineHeight: `calc(var(--default_tile_size) + 0.4rem)`,
    marginBottom: row < boardSize - 1 ? 'var(--default_tile_margin)' : 0,
    marginRight: col < boardSize - 1 ? 'var(--default_tile_margin)' : 0,
    borderRadius: '3px'
}));