import styled from "styled-components";

export default function ScoreBoard({ score, bestScore }) {
    return (
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
}

const Board = styled.div`
    flex:.8;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    & div{
        border-radius: 4px;
        background-color: #8b85bb;
        padding: 1rem;
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