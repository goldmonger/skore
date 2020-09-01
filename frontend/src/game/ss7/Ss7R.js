import React, { useState, useEffect } from 'react';
import axios from 'axios'

//import Game from '../../shared/pages/Game'
import './Ss7R.css';
import Gamer from '../../shared/components/Gamer'


const Ss7R = props => {

    const [ gameRound, setGameRound ] = useState(1)
    const [ end, setEnd ] = useState(false)
    const [ least_player, setLeastPlayer ] = useState(null)
    const [ least_skore, setLeastSkore ] = useState(null)
    const [ gameState, setGameState ] = useState(props.gameState)
    const [ seriesID, setSeriesId ] = useState(props.seriesID)
    const [ playing, setPlaying ] = useState(props.selected)
    const [ dealer, setDealer ] = useState(null)


    const roundSubmitHandler = async (e) => {
        e.preventDefault()
        let skores = []
        let curSkores = []
        let playerIds = []
        let arr_skore_input = document.getElementsByName("skore_input")
        for(let x=0; x<arr_skore_input.length; x++){
            curSkores.push(arr_skore_input[x].value)
        }
        console.log(curSkores)
        gameState.map((player, index) => {
            skores.push(player.skore)
            playerIds.push(player.id)
        })
        await axios.post('http://192.168.1.16:5000/game/ss7/round', {
            playing: playing,
            seriesID: seriesID,
            gameRound: gameRound,
            curSkores: curSkores,
            skores: skores,
            gameState: gameState,
            playerIds: playerIds,
            dealer: dealer
            
        })
        .then((response) => {
            console.log(response)
            setGameState(response.data.gameState)
            console.log(gameState)
            console.log(response.data.gameState)
          })
          .catch((error) => {
              console.log(error)
          })
        
        let nextRound
        gameRound === 7 ? setEnd(true) : nextRound = gameRound + 1
        setGameRound(nextRound)
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
                                skore={gameState[index].skore}
                                //skore={0}
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


