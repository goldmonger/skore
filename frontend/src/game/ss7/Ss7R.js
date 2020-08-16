import React, { useState } from 'react';

//import Game from '../../shared/pages/Game'
import './Ss7R.css';
import Gamer from '../../shared/components/Gamer'


const Ss7R = props => {
    const [ gameState, setGameState ] = useState([
            //for each selected player this...
            {id: 'p1', name: props.selected[0], skore: 0 },
            {id: 'p2', name: props.selected[1], skore: 0 },
            {id: 'p3', name: props.selected[2], skore: 0 }
        ])
    const [ winner, setWinner ] = useState({
        player: "acetone7",
        skore: 0
    })
    const [ gameRound, setGameRound ] = useState(1)
    const [ end, setEnd ] = useState(false)

    const onSubmitHandler = e => {
        e.preventDefault()
        let arr_skore_input = document.getElementsByName("skore_input")
        let doubleFlag = false


        //console.log("was submitted update skore with setGameState")
        if(gameRound === 1 || gameRound === 7 && !end){
            //console.log("double score flag")
            doubleFlag = true
            if(gameRound === 7){
                setEnd(true)
            }
            
        } 
        //check flags and do for now open
        if(doubleFlag === true){
            //total the scores and add a round
            for(let x=0;x<arr_skore_input.length; x++){
                if(parseInt(arr_skore_input[x].value)){
                    const playerk = {
                        ...gameState[x]
                    }
                    //console.log(playerk)
                    let originalSkore = playerk.skore
                    //console.log(originalSkore)
                    originalSkore += parseInt(arr_skore_input[x].value)
                    playerk.skore = 2*originalSkore
                    //console.log(originalSkore)
                    const playersk = [...gameState]
                    //console.log(playersk)
                    playersk[x] = playerk
                    console.log(playersk[x])
                    setGameState(playersk)
    
                }
            }
        }
        else{
            for(let x=0;x<arr_skore_input.length; x++){
                if(parseInt(arr_skore_input[x].value)){
                    const playerk = {
                        ...gameState[x]
                    }
                    //console.log(playerk)
                    let originalSkore = playerk.skore
                    //console.log(originalSkore)
                    originalSkore += parseInt(arr_skore_input[x].value)
                    playerk.skore = originalSkore
                    //console.log(originalSkore)
                    const playersk = [...gameState]
                    //console.log(playersk)
                    playersk[x] = playerk
                    console.log(playersk[x])
                    setGameState(playersk)
    
                }
            }

        }
        setGameRound(gameRound+1)
    }


    let least_skore = winner.skore
    let least_player = winner.player
   
    return (
        <div className="game-container">
        {
            end ?
                <div className="result">
                <h4 className="round_num">end of series</h4>
                <h2>winner is {least_player} with {least_skore} points</h2>
                </div>
             :

            
            <form onSubmit={onSubmitHandler}>
                <h4 className="round_num">game {gameRound}</h4>
                <Gamer id={gameState[0].id} name={gameState[0].name} skore={gameState[0].skore}  />
                <Gamer id={gameState[1].id} name={gameState[1].name} skore={gameState[1].skore}  />
                <Gamer id={gameState[2].id} name={gameState[2].name} skore={gameState[2].skore}  />
            <button type="submit" className="game-button" ><b>NEXT</b></button>
            </form>

        }
        </div>
    )
    
}

export default Ss7R;


