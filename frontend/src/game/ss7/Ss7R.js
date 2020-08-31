import React, { useState } from 'react';

//import Game from '../../shared/pages/Game'
import './Ss7R.css';
import Gamer from '../../shared/components/Gamer'


const Ss7R = props => {

    const [ gameRound, setGameRound ] = useState(1)
    const [ end, setEnd ] = useState(false)
    const [ least_player, setLeastPlayer ] = useState(null)
    const [ least_skore, setLeastSkore ] = useState(null)
    const [ gameState, setGameState ] = useState(null)


    const roundSubmitHandler = e => {
        e.preventDefault()
        let arr_skore_input = document.getElementsByName("skore_input")
        let doubleFlag = false
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
                    let playerk = {
                        ...gameState[x]
                    }
                    let originalSkore = playerk.skore
                    originalSkore += parseInt(arr_skore_input[x].value)
                    playerk.skore = 2*originalSkore
                    const playersk = [...gameState]
                    playersk[x] = playerk
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


   
    return (
        <div className="game-container">
        {
            end ?
                <div className="result">
                <h4 className="round_num">end of series</h4>
                <h2>winner is {least_player} with {least_skore} points</h2>
                </div>
             :

            
            <form onSubmit={roundSubmitHandler}>
                <h4 className="round_num">game {gameRound}</h4>
                {
                    props.selected.map((playerName, index) => {
                        return(
                            <Gamer 
                                key={playerName+index}
                                id={playerName+index}
                                name={playerName}
                                //skore={gameState[index].skore}
                                skore={0}
                            />
                        )
                    })
                }
            <button type="submit" className="game-button" ><b>NEXT</b></button>
            </form>

        }
        </div>
    )
    
}

export default Ss7R;


