import styled from "styled-components";
import ScoreBoard from "components/ScoreBoard";

export default function Header({ score, bestScore, setInitTile }) {
    return (
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
                <Button onClick={setInitTile}>New Game</Button>
            </SubText>
        </HeaderWrap>
    );
}

const HeaderWrap = styled.header`
    color: white;
    min-height : 8rem;
    text-align: left;
    padding: 0 4rem;
`

const Heading = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    flex-wrap: wrap;
    text-align: center;
    margin-bottom: 1rem;
`

const TitleWrap = styled.h1`
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

const SubText = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
`;

const Button = styled.button`
    padding: 1rem;
    border-radius: 6px;
    font-size: 1rem;
    font-weight: bold;
    background-color: #4d539485;
    color: white;
    border: 1px solid white;
    &:hover{
        background-color: #2f335d;
    }
`;
