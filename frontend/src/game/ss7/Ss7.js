import React, { useState, useEffect } from 'react'
import axios from 'axios'

import './Ss7.css'
import PlayersList from '../../shared/components/PlayersList'
import PLAYERS from '../../shared/LocalPlayers'
import Ss7R from './Ss7R'



const Ss7 = () => {
    const [selected, setSelected] = useState(null)
    const [ showRun, setShowRun ] = useState(false)
    const [ seriesID, setSeriesID ] = useState(null)
    const [ stakes, setStakes ] = useState(50)
    const [ gameState, setGameState ] = useState(null)

    useEffect(() => {
        // init the game state to a backend
        // get the code and add to collection
        let salt
        axios.get('http://192.168.1.16:5000/game/ss7/code')
            .then(response => {
                // REMOVE BEFORE PROD console.log
                console.log(response.data.code)
                salt = response.data.code
                setSeriesID(salt)
            })
    },[])
    
    const testFunc = (listSelected) => {
        //console.log(listSelected)
        setSelected(listSelected)
    }

     // Dynamic Stakes input function
     const stakesInputHandler = (e) => {
        // updates stakes from input onChange
        setStakes(e.target.value)
    }

    const beginSs7 = async (e) => {
        e.preventDefault()
        await axios.post('http://ckr.is:5000/game/ss7/init', {
            selected: selected,
            seriesID: seriesID,
            stakes: stakes
          })
          .then((response) => {
            //console.log(response)
            setGameState(response.data.gameState)
            console.log(gameState)
          })
          .catch((error) => {
              console.log(error)
          })
        setShowRun(true)
    }
    const style = {
        color: '#e3c43b'
    }
    if(showRun === false){
        return (
            <div className="game-container">
                <div className="game">
                    <h3>ss7</h3>
                    <label><b>stakes: </b></label><label style={style}><b>{stakes}</b></label>
                    <input type="text" name="stakes" className="game-input1" id="stakes_input" value={stakes} onChange={stakesInputHandler} />
                    <h5 className="instructions" >Add players clockwise</h5>
                    <h5 className="instructions" >Dealer as player 1</h5>
                    <form onSubmit={(e) => beginSs7(e)}>
                    <PlayersList 
                        player_items={PLAYERS} 
                        submission={(listSelected) => testFunc(listSelected)}
                        selected={selected}
                    />
                    <button 
                    className="game-button"
                    type="submit"
                    >
                    START
                    </button>
                    </form>
                </div>
            </div>
         
        )
    }
    else{
        return (
            <div className="game-container">
                <div className="game">
                    <h3>ss7</h3>
                    <Ss7R selected={selected} seriesID={seriesID} gameState={gameState} />
                </div>
            </div>
        )
    }
    
}

export default Ss7;