import React, {useState, useEffect} from "react";
import HighScoreList from "../Components/Highscore";
import Player1Hand from "../Components/Player1Hand";
import Player2Hand from "../Components/Player2Hand";
import SnapPool from "../Components/SnapPool";
import { postHighScore as dbpostHighScore } from "../HighScoreService";
import NameForm1 from "../Components/NameForm";
import { getHighScores as dbGetHighScores, deleteHighScore as dbDeleteHighScore, updateHighScore } from "../HighScoreService";
import Instructions from "../Components/Instructions";
import Controls from "../Components/Controls";
import Player1Info from "../Components/Player1Info";
import Player2Info from "../Components/Player2Info";
import snapPool from "../Components/SnapPool";
import PlayerSelector from "../Components/PlayerSelect";
import './SnapContainer.css';
import EndGame from "../Components/EndGame";


const SnapContainer = () => {

    const [pool, setPool] = useState([]);
    const [hand1, setHand1] = useState([]);
    const [hand2, setHand2] = useState([]);
    const [highScores, setHighScores] = useState([]);
    const [isShown, setIsShown] = useState(false);
    const [isShown2, setIsShown2] = useState(false);
    const [score1, setScore1] = useState(0);
    const [score2, setScore2] = useState(0);
    const [player1name, setPlayer1Name] = useState("");
    const [player2name, setPlayer2Name] = useState("");
    const [selectedPlayer1, setSelectedPlayer1] = useState({});
    const [selectedPlayer2, setSelectedPlayer2] = useState({});
    const [turn, setTurn] = useState(1);
    const [gameState, setGameState] = useState("pre-game")
    const [gameEnded, setGameEnded] = useState(false)
    const [winner, setWinner] = useState({})

    //document.addEventListener('keydown', logKey);

    useEffect(() => {
        getPool();
    }, [])



    useEffect(() => {
        getHighScores();
    }, [])


    const getPool = function(){
        fetch('https://deckofcardsapi.com/api/deck/new/draw/?count=52')
        .then(res => res.json())
        .then(data => setPool(data.cards))
    }

    const dealPool = function(){
        let newPool = []
        let newHand1 = pool.slice(0, 26)
        let newHand2 = pool.slice(26, 52)
        setPool(newPool)
        setHand1(newHand1)
        setHand2(newHand2)
        setGameState("game-started")

    }

    // function logKey(a) {
    //     hand1.shift()
    //     setHand1(hand1)
    //     console.log(hand1)

    // }

    const playCard1 = function(){
    if (hand1.length > 0){
        let card = hand1.pop()
        let newPool = [...pool, card]
        setHand1(hand1)
        setPool(newPool)
        }
    }


    const postHighScore = newHighScore => {
        dbpostHighScore(newHighScore)
          .then(savedHighScore => setHighScores([ ...highScores, savedHighScore ]))
      };

    // const postHighScore2 = newHighScore => {
    //     dbpostHighScore(newHighScore)
    //       .then(savedHighScore => setHighScores([ ...highScores, savedHighScore ]))
    //   };

   
      

    const getHighScores = function(){
        dbGetHighScores()
        .then((data) => {
            // console.log(data);
            setHighScores(data)
        })
    }

    

    const deleteHighScore = (id) => {
        dbDeleteHighScore(id).then(()=>{
            let temp = highScores.map(g=>g);
            const toDel = highScores.map(g =>g._id).indexOf(id);
            temp.splice(toDel, 1);
            setHighScores(temp);
            })
        }

    const updatePlayerScore = updatedScore => {
        updateHighScore(updatedScore);
    
        const updatedScoreIndex = highScores.findIndex(highScore => highScore._id === updatedScore._id);
        const updatedScores = [...highScores];
        updatedScores[updatedScoreIndex] = updatedScore;
        setHighScores(updatedScores);
    
    
      }
    //   function to be added to appropriate component in order to invoke updatePlayerScore function
    const givePlayer1FinalScore = () => {
        if (score1 > selectedPlayer1.score){
            updatePlayerScore({
                _id: selectedPlayer1._id,
                name: selectedPlayer1.name,
                score: score1
        })
    } else {
        console.log("Score not good enough!!!");
    }
        
    }

    const givePlayer2FinalScore = () => {
        if (score2 > selectedPlayer2.score){
        updatePlayerScore({
            _id: selectedPlayer2._id,
            name: selectedPlayer2.name,
            score: score2
        })
        
    }}


    const gameEnd = function (){
        if (hand1.length === 52){
            givePlayer1FinalScore()
            setScore2(0)
            givePlayer2FinalScore()
            setGameEnded(true)
        }
        if (hand2.length === 52){
            givePlayer2FinalScore()
            setScore1(0)
            givePlayer1FinalScore()
            setGameEnded(true)
        }
    }

    
    const [highlight, setHighlight] = useState("2px solid black");
    function handleKeyPress(e) {
        var key = e.key;
        if (key === "a") {
            if ((hand1.length > 0) && (turn === 1)){
                let card = hand1.pop()
                let newPool = [...pool, card]
                setHand1(hand1)
                setPool(newPool)
                setTurn(2)
            }
        }
        if (key === "l") {
            if ((hand2.length > 0) && (turn === 2)){
                let card = hand2.pop()
                let newPool = [...pool, card]
                setHand2(hand2)
                setPool(newPool)
                setTurn(1)
            }
        }
        if (key === "d") {
            if ((pool[pool.length-1].value === pool[pool.length-2].value) || (pool[pool.length-1].value === pool[pool.length-3].value)){
                let newScore1 = (score1 + pool.length)
                setScore1(newScore1)
                let newHand1 = hand1.concat(pool)
                setHand1(newHand1)
                setPool([])
                setTurn(1)
            }
            else {
                let newScore = (score1 - 5)
                setScore1(newScore)
                setTurn(2)
            }
        }
        if (key === "j") {
            if ((pool[pool.length-1].value === pool[pool.length-2].value) || (pool[pool.length-1].value === pool[pool.length-3].value)){
                let newScore2 = (score2 + pool.length)
                setScore2(newScore2)
                let newHand2 = hand2.concat(pool)
                setHand2(newHand2)
                setPool([])
                gameEnd()
                setTurn(2)
            }
            else {
                let newScore2 = (score2 - 5)
                setScore2(newScore2)
                setTurn(1)
            }
        }
        if (((key === "l" ) || (key === "a")) && !((pool[pool.length-1].value === pool[pool.length-2].value) || (pool[pool.length-1].value === pool[pool.length-3].value)) && (pool.length === 52)){
            dealPool()
        }
        if (key === "p"){ //player 2 cheat button to scoop up all of pool
            let newScore2 = (score2 + pool.length)
            setScore2(newScore2)
            let newHand2 = hand2.concat(pool)
            setHand2(newHand2)
            setPool([])
            gameEnd()
        }
    }

    return(
        <div class="container">
            <div class="playerform">
            <NameForm1 postHighScore={postHighScore} setPlayer1Name={setPlayer1Name} player1name={player1name}/>
            <PlayerSelector highScores={highScores} setSelectedPlayer1={setSelectedPlayer1} setSelectedPlayer2={setSelectedPlayer2}/>
            <button type="text" onKeyPress={(e) => handleKeyPress(e)} onClick={dealPool}>Start Game</button>
            </div>
            <div class="title">
                <h1><u>SNAP</u></h1>
            </div>
            <div class="instructions">
            <button
            onMouseEnter={() => setIsShown(true)}
            onMouseLeave={() => setIsShown(false)}>
            Instructions
            </button>
            <button 
            onMouseEnter={() => setIsShown2(true)}
            onMouseLeave={() => setIsShown2(false)}>
            Controls
            </button>
            {isShown && (
            <div class="ipopup">
            <Instructions/>
            </div>
            )}
            {isShown2 && (
            <div class="cpopup">
            <Controls/>
            </div>
            )}
            </div>
            <div class="p1hand">
            <Player1Hand hand1={hand1}/>
            </div>
            <div class="snappool">
            {gameEnded ? <EndGame score1={score1} score2={score2} selectedPlayer1={selectedPlayer1} selectedPlayer2={selectedPlayer2} winner={winner} setWinner={setWinner} setGameEnded={setGameEnded} setGameState={setGameState}/> : <SnapPool pool={pool}/>}
            </div>
            <div class="p2hand">
            <Player2Hand hand2={hand2}/>
            </div>
            <Player1Info selectedPlayer1={selectedPlayer1} score1={score1}/>
            <HighScoreList highScores={highScores} deleteHighScore={deleteHighScore} />
            <Player2Info selectedPlayer2={selectedPlayer2} score2={score2}/>
        </div>
        )
}

export default SnapContainer;