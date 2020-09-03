import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios'

import './Jackpot.css'
import PlayersList from '../../shared/components/PlayersList'
import Gamer from '../../shared/components/Gamer'
import PLAYERS from '../../shared/LocalPlayers';

const Jackpot = (props) => {

    const [ selected, setSelected ] = useState(null)
    const [ stakes, setStakes ] = useState(50)
    const [ config, setConfig ] = useState(true)
    const [ gameRound, setGameRound ] = useState(1)
    const [ gameState, setGameState ] = useState(null)
    const [ playing, setPlaying ] = useState(null)
    const [ seriesID, setSeriesId ] = useState(null)
    const [ dealer, setDealer ] = useState('')
    const [ dealerIndex, setDealerIndex ] = useState(null)
    const [ openerIndex, setOpenerIndex ] = useState(null)
    const [ opener, setOpen ] = useState(null)
    const [ out_list, setOutList ] = useState(null)



    useEffect(() => {
        // retrieves the SERIES CODE for current series 
        // and sets the series id
        let salt
        axios.get('http://192.168.1.16:5000/game/jackpot/code')
            .then(response => {
                // REMOVE BEFORE PROD console.log
                console.log(response.data.code)
                salt = response.data.code
                setSeriesId(salt)
            })
    },[])

    useEffect(() => {
        selected===null ? 
        setDealer(null)
        : 
        setDealer(selected[0])
        setPlaying(selected)
    },[selected])


    // Dynamic Stakes input function
    const stakesInputHandler = (e) => {
        // updates stakes from input onChange
        setStakes(e.target.value)
    }


    // Function for NEW GAME INITIALIZATION
    // ====================================
    const newGameGenerateHandler = async (e) => {
        // adds an entry into series collection in db
        // series has seriesID, playing array, stakes
        // should also set the dealer from input
        // round submit onwards we need to check the opener and then work backwards for dealer
        e.preventDefault()
        setDealer(selected[0])
        setPlaying(selected)
        const response = await fetch('http://192.168.1.16:5000/game/jackpot/init', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                playerNames: playing,
                stakes: stakes,
                seriesID: seriesID,
                dealer: selected[0]

            })
        })
        const responseData = await response.json()
        setOpen(responseData.opener)
        
        setGameState(responseData.gameState)

        setConfig(false)
        let inputs = document.getElementsByName('skore_input')
        inputs[0].focus()
        inputs[0].click()
        //console.log("dealer index first ",dealerIndex)
    }

    // Function for each ROUND
    // =======================
    const onRoundSubmitHandler = async (e) => {
        e.preventDefault()
        //send http post req with current game state and the current skores
        //expect a new game state object to be returned
        // and update this object as the game state
        let inputs = document.getElementsByName('skore_input')
        let curSkores = []
        let skores = []
        let playerNames = []
        let playerIds = []
        let newGameState = []
        let newPlaying = []
        let outs = []
        if(out_list !== null){
            outs = [...out_list]
        }

        playing.map((player, index) => {
            skores.push(gameState[index].skore)
            playerNames.push(player)
            playerIds.push(gameState[index].id)
            curSkores.push(inputs[index].value)
        })
        let newGameObj = {
            playerNames: playerNames,
            playerIds: playerIds,
            skores: skores,
            round: gameRound,
            curSkores: curSkores,
            seriesID: seriesID,
            dealer: dealer,
            opener: opener
        }

        const response = await fetch('http://192.168.1.16:5000/game/jackpot/round', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newGameObj)
        })
        const responseData = await response.json()
        
        responseData.playerNames.map((player, index) => {
            newPlaying.push(player)
            let updatedPlayer = {
                name: player,
                id: responseData.playerIds[index],
                skore: responseData.skores[index]
            }
            newGameState.push(updatedPlayer)
        })
        responseData.outs.map((player, index) => {
            outs.push(player)
        })
        setOutList(outs)
        setPlaying(newPlaying)
        let currentRound = gameRound
        setGameRound(currentRound+1)
        
        /* WORKING LOGIC for NEXT DEALER without opener logic */
        
        /*
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
        */
         
        setGameState(newGameState)
        //console.log(gameState)
        //console.log(playing)

        /*
        // AUTO FOCUS AND CLICK
        for(let x=0; x<inputs.length; x++){
            inputs[x].value = ''
        }
        inputs[0].focus()
        inputs[0].click()
        */

    }

    const testFunc = (listSelected) => {
        console.log(listSelected)
        setSelected(listSelected)
    }

    if(config){
        const style = {
            color: '#e3c43b'
        }
        return (
            <div className="game-container  ">
        
                <h3>Jackpot</h3>
                <label><b>stakes: </b></label><label style={style}><b>{stakes}</b></label>
                <input type="text" name="stakes" className="game-input1" id="stakes_input" value={stakes} onChange={stakesInputHandler} />
                <h5 className="instructions" >Add players clockwise</h5>
                <h5 className="instructions" >Dealer as player 1</h5>
                <br />
                <div className="new_game_form_div">
                    <PlayersList 
                        player_items={PLAYERS} 
                        submission={(listSelected) => testFunc(listSelected)}
                        selected={selected}
                    />
                    <button className="game-button" onClick={(e) => newGameGenerateHandler(e)}>START</button>
                </div>
            </div> 
        )
    }
    else{
        const housefull = {
            color: '#666666'
        }
        const gold = {
            color: '#e3c43b'
        }
        if(playing.length > 1){
            return (
                //team block render
                <div className="game-container">
                    <div className="game">
                    <h3>Jackpot {stakes}</h3>
                    <h5 style={housefull}>{seriesID}</h5>
                    <h5>game {gameRound} dealer: <span style={gold}>{dealer}</span></h5>
                        <div className="game-container">
                            <form onSubmit={onRoundSubmitHandler}>
                                {
                                    playing.map((player, index) => {
                                        return (
                                            <Gamer 
                                            key={player+index}
                                            id={player+index} 
                                            name={player} 
                                            skore={gameState[index].skore} 
                                            />
                                        )
                                    })
                                }
                                <button className="game-button" type="submit">NEXT</button>
                            </form>
                            <div className="out_list">
                                {out_list ?
                                    out_list.map((player, index) => {
                                        return(
                                            <Gamer 
                                            key={player+index}
                                            id={player+index} 
                                            name={player + " out"} 
                                            skore={250} 
                                            />
                                        )
                                    })
                                    :
                                    null
                                }
                            </div>         
                        </div>
                    </div>
                </div> 
            )
        }
        else{
            return(
                
                <div className="game-container">
                    <div className="game">
                        <h3>Jackpot {stakes}</h3>
                        <h5 style={housefull}>{seriesID}</h5>
                        <div className="result">
                            <h4 className="round_num">end of series</h4>
                            <h2>winner is {playing[0]}</h2>
                        </div>     
                    </div>
                </div>
            )
        }     
    }
}
export default Jackpot
