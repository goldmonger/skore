import React, { useState, useRef } from 'react';
import './Jackpot.css'

import Gamer from '../../shared/components/Gamer'

const Jackpot = (props) => {

    const [ gang, setGang ] = useState(false)
    const [ stakes, setStakes ] = useState(100)
    const [ config, setConfig ] = useState(true)
    const [ gameRound, setGameRound ] = useState(1)
    const [ gameState, setGameState ] = useState(props.all_players)
    const [ playing, setPlaying ] = useState(null)


    const newPlayerNameInputRef = useRef(null)

    const gangFlagToggleHandler = () => {
        if (gang === true){
            setGang(false)
        }
        else{
            setGang(true)
        }
    }

    const stakesInputHandler = (e) => {
        setStakes(e.target.value)
    }

    const newGameGenerateHandler = async (e) => {
        e.preventDefault()
        //setConfig(false)
        //send the array of players to backend
        //then the backend has to return a json object for game state initialised to 0
        //then we need to set this as game state for round 1
        const response = await fetch('http://localhost:5000/game/jackpot', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                playerNames: playing
            })
        })
        const responseData = await response.json()
        console.log(responseData)
        setGameState(responseData)
        setConfig(false)

      
    }

    const addPlayerHandler = (e) => {
        e.preventDefault()
        let currentPlaying = []
        if(playing !== null){
            currentPlaying = [...playing]
        }
        else{
            currentPlaying = []
        }
        currentPlaying.push(newPlayerNameInputRef.current.value)
        console.log(currentPlaying)
        setPlaying(currentPlaying)
        newPlayerNameInputRef.current.value = ''

    }
    

    const onRoundSubmitHandler = (e) => {
        e.preventDefault()
        //send http post req with current game state and the current skores
        //expect a new game state object to be returned
        // and update this object as the game state
        let currentRound = gameRound + 1
        setGameRound(currentRound)
        let arr_skore_input = document.getElementsByClassName("current_skore_input")
        console.log(arr_skore_input.length)
        for(let x=0;x<arr_skore_input.length; x++){
            //console.log("run", x, "game state before mod", gameState)
            if(parseInt(arr_skore_input[x].value)){
                const player = {
                    ...gameState[x]
                }
                //console.log("player to be modded ", player)
                let originalSkore = player.skore
                //console.log(" existing score ", originalSkore)
                originalSkore += parseInt(arr_skore_input[x].value)
                player.skore = originalSkore
                const players = [...gameState]
                //console.log(players)
                players[x] = player
                setGameState(players)

            }
        }
        //console.log(gameState)
    }

    const configToggleHandler = () => {
        setConfig(false)
    }





    let dynGameState = []
    if(config){
        const style = {
            color: '#e3c43b'
        }
        return (
            <div className="game-container  ">
        
                <h3>Jackpot</h3>
                <label><b>stakes: </b></label><label style={style}><b>{stakes}</b></label>
                <input type="text" name="stakes" className="game-input1" id="stakes_input" value={stakes} onChange={stakesInputHandler} />
                <br />
                <label><b>gang flag: </b></label><label style={style}><b>{gang ? "ON" : "OFF" }</b></label>
                {gang ?
                <button value="reset" onClick={gangFlagToggleHandler} className="game_flag_button">reset</button>
                :
                <button value="set" onClick={gangFlagToggleHandler} className="game_flag_button" >set</button>
                }
                {!gang ?
                <div className="new_game_form_div">
                    <label>enter player name to add </label><input ref={newPlayerNameInputRef} type='text' className="game-input1"></input>
                    <button className="game-button" onClick={addPlayerHandler}>ADD</button>
                    <button className="game-button" onClick={newGameGenerateHandler}>START</button>
                </div>
                
                :
                null
                }
                {playing === null ?
                    null 
                    :
                    
                    playing.map((p, index) => {
                        return (
                            <span style={style}>{p} </span>
                        )
                    })

                }
                {!gang ?
                null
                :
                <button className="game-button" onClick={configToggleHandler}>START</button>
                }    
            </div> 
        )
    }

    else{
        if(gang){
            const housefull = {
                color: '#666666'
            }
            setGameState(props.all_players)
            return (
                //full team block render
                <div className="game-container">
                    <div className="game">
                        <h3>Jackpot {stakes}</h3> 
                        <h5 style={housefull}>{gang ? "full house" : "" }</h5>
                        <div className="game-container">
                        <form onSubmit={onRoundSubmitHandler}>
                            {
                                props.all_players.map((player, index) => {
                                    return (
                                        <Gamer 
                                        key={player.id}
                                        id={player.id} 
                                        name={player.name} 
                                        skore={gameState[index].skore} 
                                        />
                                    )
                                })
                            }
                            <button className="game-button" type="submit">NEXT</button>
                            </form>
                            
                        </div>

                        
                    </div>
                </div>
                
            )
        }
        else{
            if(playing !== null){
                return (
                    //dynamic team block render
                    <div className="game-container">
                        <div className="game">
                        <h3>Jackpot {stakes}</h3>
                        <h5>game {gameRound}</h5>
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
                                
                            </div>
                            
                        </div>
                    </div>
                    
                )
            }
            
        }
        //setGameState(dynGameState)
        
    }
    
}

export default Jackpot;