import styled, { css, keyframes } from "styled-components";
const defaultSize = '8rem';
const defaultMargin = '.8rem';
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

export const HeaderWrap = styled.header`
    color: white;
    min-height : 8rem;
    text-align: left;
    padding: 0 4rem;
`

export const Heading = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    flex-wrap: wrap;
    text-align: center;
    margin-bottom: 1rem;
`

export const TitleWrap = styled.h1`
    font-weight: bold;
    flex: 1;
    text-align: left;
    white-space: nowrap;
    & .title{
        font-size: 4rem;
    }

    & .sub-title{
        display: inline-block;
        font-size: 1.2rem;
        margin-left: 6px;
        color: #eeeeee99;
        margin: 4px 0 4px 6px;
        &::first-letter{
            color: white;
        }
    }
`;

export const Board = styled.div`
    flex:.8;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    & div{
        border-radius: 4px;
        background-color: #8b85bb;
        padding: 10px;
        font-weight: bold;
        text-align: center;
        min-width: 48%;
        & label{
            display: block;
            margin-bottom: 4px;
            color: #ffffffb0;
            font-size: 1.2rem;
        }

        & p{
            color: white;
            font-size: 2rem;
        }
        &:last-child{
            margin-left: 4px;
        }
    }
`

const ScoreBoard = ({ score, bestScore }) => (
    <Board>
        <div>
            <label>SCORE</label>
            <p>{score}</p>
        </div>
        <div>
            <label>BEST</label>
            <p>{bestScore}</p>
        </div>
    </Board>
);

const SubText = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
`;

export const Button = styled.button`
    padding: 1rem;
    border-radius: 6px;
    font-size: 1rem;
    font-weight: bold;
    background-color: #4d539485;
    color:white;
    border: 1px solid white;
    &:hover{
        background-color: #2f335d;
    }
`;


export const Header = ({ children, score, bestScore }) => (
    <HeaderWrap>
        <Heading>
            <TitleWrap>
                <span className="title">2048</span>
                <span className="sub-title">⭐️ Space Ver.</span>
            </TitleWrap>
            <ScoreBoard score={score} bestScore={bestScore} />
        </Heading>
        <SubText>
            <p>🌙 made by yeyo</p>
            {children}
        </SubText>
    </HeaderWrap>
)

export const Main = styled.main`
    display: flex;
    flex-direction:column;
    align-items: center;
    justify-content: center;
    margin-top: 2rem;
`;


export const Container = styled.section`
    display: flex;
    flex-direction: row;
    flex-wrap:wrap;
    border-radius: 10px;
    background-color: #8796ce;
    padding: ${defaultMargin};
    position: relative;
    overflow: hidden;
`;

export const GridContainer = styled.div`
    display:flex;
    flex-direction: row;
    flex-wrap:wrap;
    ${({ boardSize }) => {
        return css`
            width: ${`calc(${defaultSize} * ${boardSize} + ${defaultMargin} * ${boardSize - 1})`};
            height: ${`calc(${defaultSize} * ${boardSize} + ${defaultMargin} * ${boardSize - 1})`};
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

const Cell = styled.div(({ row, col, boardSize }) => ({
    width: defaultSize,
    height: defaultSize,
    lineHeight: `calc(${defaultSize} + 0.4rem)`,
    marginBottom: row < boardSize - 1 ? defaultMargin : 0,
    marginRight: col < boardSize - 1 ? defaultMargin : 0,
    borderRadius: '3px'
}));

export const GridCell = styled(Cell)`
    background-color: #d9e1ff;
`;

export const TileContainer = styled.div`
  position: absolute;
  z-index:1;
`;

export const Tile = styled(Cell).attrs(({ tile }) => {
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
                x: `calc(${col} * ${defaultSize} + ${defaultMargin} * ${col})`,
                y: `calc(${row} * ${defaultSize} + ${defaultMargin} * ${row})`,
                prevX: `calc(${prevCol} * ${defaultSize} + ${defaultMargin} * ${prevCol})`,
                prevY: `calc(${prevRow} * ${defaultSize} + ${defaultMargin} * ${prevRow})`
            }
            return css`
                transform: ${`translate(${position.prevX},${position.prevY})`};
                opacity: ${isNew ? 0 : 1};
                animation-duration: ${isCombined ? '.2s' : '.2s'};
                animation-delay: ${isNew ? '.2s' : 'none'};
                animation-timing-function: ease-in;
                animation-fill-mode: forwards;
                z-index: ${(isNew || isCombined) ? 1 : 0};
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

const Modal = styled.div`
    position: absolute;
    width:100%;
    height: 100%;
    top:0;
    left: 0;
    background: rgba(255,255,255,.6);
    z-index: 100;
    display:flex;
    flex-direction:column;
    justify-content: center;
    align-items:center;
    opacity:0;
    transition: opacity .4s .8s ease-in;
    &{
        opacity: 1;
    }
`

const Message = styled.div`
    font-size: 4rem;
    font-weight: 900;
    color: #30335d;
`;

const ButtonWrap = styled.div`
    button{
        color: white;
        border-radius: 4px;
        padding: 1rem;
        font-size: 1.2rem;
        font-weight: bold;
        margin-top: 2rem;
        &.btn-continue{ background-color: #ffcf62;}
        &.btn-lose{background-color:#8b85bb;};
        &.btn-new-game{background-color: #e9406d};
        :hover{
            opacity: .8;
        }
    }
`;

export const GameModal = ({ gameModal, handleGameButtonClick }) => (
    <Modal>
        <Message>{gameModal.message}</Message>
        <ButtonWrap onClick={handleGameButtonClick}>{gameModal.button}</ButtonWrap>
    </Modal>
)

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