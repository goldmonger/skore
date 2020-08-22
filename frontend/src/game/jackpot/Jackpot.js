import React, { useState, useRef, useEffect } from 'react';
import './Jackpot.css'

import Gamer from '../../shared/components/Gamer'

const Jackpot = (props) => {

    const [ gang, setGang ] = useState(false)
    const [ stakes, setStakes ] = useState(100)
    const [ config, setConfig ] = useState(true)
    const [ gameRound, setGameRound ] = useState(1)
    const [ gameState, setGameState ] = useState(props.all_players)
    const [ playing, setPlaying ] = useState(null)
    const [ dealer, setDealer ] = useState('')
    const [ gameCode, setGameCode ] = useState(null)


    const newPlayerNameInputRef = useRef(null)
    const dealerInputRef = useRef(null)


    useEffect(async () => {
        //send req for a new jackpot game code to backend
        const response = await fetch('http://localhost:5000/game/jackpot/code', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
            
        })
        const responseData = await response.json()
        setGameCode(responseData.code)
        
    },[])

    useEffect(() => {
        if(config){
            
            newPlayerNameInputRef.current.focus()
            newPlayerNameInputRef.current.click()
            
        }
        
    },[playing])

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
        //alert("sending the fetch")
        const response = await fetch('http://localhost:5000/game/jackpot/init', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                playerNames: playing
            })
        })
        const responseData = await response.json()
        //console.log(responseData)
        setDealer(dealerInputRef.current.value)
        //console.log(dealerInputRef.current.value)
        console.log(dealer)
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
        //console.log(currentPlaying)
        setPlaying(currentPlaying)
        newPlayerNameInputRef.current.value = ''

    }
    

    const onRoundSubmitHandler = async (e) => {
        e.preventDefault()
        //send http post req with current game state and the current skores
        //expect a new game state object to be returned
        // and update this object as the game state
        let inputs = document.getElementsByName('skore_input')
        let curSkores = []
        for(let s=0; s< inputs.length; s++){
            curSkores.push(inputs[s].value)
        }
        //console.log(curSkores)
        let skores = []
        let playerNames = []
        let playerIds = []
        gameState.map(player => {
            skores.push(player.skore)
            playerNames.push(player.name)
            playerIds.push(player.id)
        })
        let newGameObj = {
            playerNames: playerNames,
            playerIds: playerIds,
            skores: skores,
            round: gameRound,
            curSkores: curSkores
        }

        
        const response = await fetch('http://localhost:5000/game/jackpot/round', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newGameObj)
        })
        const responseData = await response.json()
        //console.log(responseData)
        let newGameState = []
        let outplayer = ""
        responseData.playerNames.map((player, index) => {
            if(parseInt(responseData.skores[index]) >= 250){
                inputs[index].value = 250
                inputs[index].disabled = true
                
                outplayer = player + " out"
            }
            else{
                outplayer = player
            }
            let updatedPlayer = {
                name: outplayer,
                id: responseData.playerIds[index],
                skore: responseData.skores[index]
            }
            newGameState.push(updatedPlayer)
        })
        let currentRound = gameRound
        setGameRound(currentRound+1)
        let nextDealer = playing.findIndex(p => {
            return p === dealer
        })
        //console.log('next dealer', nextDealer, 'round', gameRound)
        if(nextDealer < playing.length-1){
            nextDealer += 1
        }
        else{
            nextDealer = (nextDealer+1) % playing.length
        }
        console.log(nextDealer)
        setDealer(playing[nextDealer])
        setGameState(newGameState)
        for(let s=0; s< inputs.length; s++){
            inputs[s].value = ''
        }
       
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
                <label><b>Join Code: </b></label> <input type="text" name="join_game_input" className="game-input1" />
                <h4>New Game Code: {gameCode}</h4>
                <label><b>stakes: </b></label><label style={style}><b>{stakes}</b></label>
                <input type="text" name="stakes" className="game-input1" id="stakes_input" value={stakes} onChange={stakesInputHandler} />
                <br />
                <label><b>gang flag: </b></label><label style={style}><b>{gang ? "ON" : "OFF" }</b></label>
                {gang ?
                <button value="reset" onClick={gangFlagToggleHandler} className="game_flag_button">reset</button>
                :
                <button value="set" onClick={gangFlagToggleHandler} className="game_flag_button" disabled>set</button>
                }
                {!gang ?
                <div className="new_game_form_div">
                    <label><b>add player: </b></label><input ref={newPlayerNameInputRef} type='text' className="game-input1" autocapitalize="off"></input>
                    <label><b>dealer: </b></label><input ref={dealerInputRef} type='text' className="game-input1" autocapitalize="off"></input>
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
                        <h5>game {gameRound}</h5>
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
                        <h5>game {gameRound} dealer: {dealer}</h5>
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