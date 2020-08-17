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
    const [ getPlayers, setGetPlayers ] = useState(null)
    const [ nextId, setNextId ] = useState('p'+String(1))

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

    const newGameGenerateHandler = (e) => {
        e.preventDefault()
        // TAKE THE PLAYING ARRAY AND GENERATE THE TABLE FOR THEM
        // EACH SUBMIT FROM TABLE SEND TO BACK END
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
        //send http post req 
        //expect an array of skores to be returned
        // for all playing map skores in state here
        // check out redux once properly maybe it can help
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
            return (
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
                                        skore={0} 
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
    
};

export default Jackpot;