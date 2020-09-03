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
    const [ dealer, setDealer ] = useState(props.selected[0])



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
            //console.log(response)
            setGameState(response.data.gameState)
            //console.log(gameState)
            //console.log(response.data.gameState)
            let leastSkore = response.data.skores[0]
            for(let x=0; x<response.data.skores.length; x++){
                if(response.data.skores[x] < leastSkore){
                    leastSkore = response.data.skores[x]
                }
            }
            setLeastSkore(leastSkore)
            let leastIndex = response.data.skores.findIndex(skore => {
                return skore===leastSkore
            })
            setLeastPlayer(response.data.playerNames[leastIndex])


          })
          .catch((error) => {
              console.log(error)
          })
        
        let nextRound
        gameRound === 7 ? setEnd(true) : nextRound = gameRound + 1
        setGameRound(nextRound)
        
        /*
        // AUTO FOCUS AND CLICK THE BOX
        if(gameRound<7){
            for(let x=0; x<arr_skore_input.length; x++){
                arr_skore_input[x].value = ''
            }
            arr_skore_input[0].focus()
            arr_skore_input[0].click()
        }
        */
        let nextDealer = playing.findIndex(p => {
            return p === dealer
            // return index of current dealer into next dealer
        })
        if(nextDealer < playing.length-1){
            nextDealer += 1
        }
        else{
            nextDealer = (nextDealer+1) % playing.length
        }
        setDealer(playing[nextDealer])
        console.log(least_player)
        console.log(least_skore)
        
    }

    const gold = {
        color: '#e3c43b'
    }

   
    return (
        <div className="game-container">
            <h5>game {gameRound} dealer: <span style={gold}>{dealer}</span></h5>
        {
            end ?
                <div className="result">
                <h4 className="round_num">end of series</h4>
                <h2>winner is {least_player} with {least_skore} points</h2>
                </div>
             :

            <form onSubmit={roundSubmitHandler}>
                {//<h4 className="round_num">game {gameRound}</h4>
                }
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


