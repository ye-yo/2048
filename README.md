# 🌙 2048

<div align="center">
<img src="https://user-images.githubusercontent.com/50618754/154788864-3ee8621c-7159-45a8-94bc-fbb946a22af5.png"/>
<br></br>
  
![Generic badge](https://img.shields.io/badge/React-17.0.2-skyblue.svg)
![Generic badge](https://img.shields.io/badge/styled_components-5.3.3-hotpink.svg)
</div>

## 소개

> 밤하늘 버전의 2048 웹게임입니다.
> 각 타일은 밤하늘과 비슷한 색상을 띄고 있고 숫자가 높아질 수록 다양한 별의 색상을 가진 타일을 확인할 수 있습니다!
>
> ### [2048 Night Ver. 바로가기](https://ye-yo.github.io/2048/)
> ### [블로그 포스팅](https://ye-yo.github.io/toy/2022/02/19/2048-game.html)

![image](https://user-images.githubusercontent.com/50618754/154789466-cbc469a9-49af-4243-ba51-a93e102184c4.png)

## 기능

### 1) 타일 이동

- 웹은 방향키 모바일은 터치로 타일을 이동시킬 수 있습니다.
- 같은 숫자의 타일이 이웃할 경우 타일이 합쳐집니다.
- 타일의 변화가 있을 경우 새로운 타일이 추가됩니다.

### 2) 게임 승리/ 오버 조건

- 보드가 꽉찬 상태에서 더 이상 움직일 것이 없으면 게임 오버됩니다.
- 2048 숫자 달성시 게임 승리 및 게임을 계속할지 결정할 수 있습니다.
  (추가로 배경색을 지정해 놓은 숫자는 8192까지이기 때문에 8192 숫자에 도달 시 게임이 클리어됩니다.)
- new game 버튼을 클릭해 게임을 재시작할 수 있습니다.

### 3) 스코어

- 현재 점수 표시
- 최고 점수는 기록되어 다음 게임 시작시에도 확인할 수 있습니다.
