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
    const [ dealer, setDealer ] = useState(' ')
    const [ inOut, setInOut ] = useState(null)
    const [ seriesID, setSeriesId ] = useState(null)
    const [ winner, setWinner ] = useState(null)


    const newPlayerNameInputRef = useRef(null)
    const dealerInputRef = useRef(null)


    useEffect(() => {
        if(config && gang === false){
            newPlayerNameInputRef.current.focus()
            newPlayerNameInputRef.current.click()
        }
        
    },[playing])

    
  




    const gangFlagToggleHandler = () => {
        gang ?
        setPlaying(null)
        :
        setPlaying(["ravi", "roopa", "ronnie"])

        gang ? 
        setGang(false)
        :
        setGang(true)
        
    }

    const stakesInputHandler = (e) => {
        setStakes(e.target.value)
    }

    const newGameGenerateHandler = async (e) => {
        e.preventDefault()
        const response = await fetch('http://192.168.1.16:5000/game/jackpot/init', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                playerNames: playing,
                stakes: stakes
                //seriesID: seriesID

            })
        })
        const responseData = await response.json()
        //console.log(responseData)
        setDealer(dealerInputRef.current.value)
        //console.log(dealerInputRef.current.value)
        //console.log(dealer)
        setGameState(responseData.gameState)
        setSeriesId(responseData.code)

        setConfig(false)
        

        

      
    }

    const addPlayerHandler = (e) => {
        e.preventDefault()
        
        if( dealerInputRef.current.value === '' || dealerInputRef.current.value === null){
            dealerInputRef.current.value = newPlayerNameInputRef.current.value
        } 
        setDealer(dealerInputRef.current.value)

        let currentPlaying = []
        let currentInOut = []
        if(playing !== null){
            currentPlaying = [...playing]
            currentInOut = [...inOut]
        }
        currentPlaying.push(newPlayerNameInputRef.current.value)
        currentInOut.push("in")
        setPlaying(currentPlaying)
        setInOut(currentInOut)
        newPlayerNameInputRef.current.value = ''
    }
    
    const dispatchWinnerScreen = (arg1) => {
        setWinner(arg1)
    }

    const onRoundSubmitHandler = async (e) => {
        e.preventDefault()
        //send http post req with current game state and the current skores
        //expect a new game state object to be returned
        // and update this object as the game state
        let inputs = document.getElementsByName('skore_input')
        let curSkores = []
        
        // idk why i created this let maybe to check for all skips or something 
        let disabledBoxCount = 0
        let outIndex = []
        for(let s=0; s< inputs.length; s++){
            curSkores.push(inputs[s].value)
            if(inputs[s].readonly === true){
                disabledBoxCount += 1
                outIndex.push('out')
            }
            else{
                outIndex.push('in')
            }
        }
        setInOut(outIndex)
        if(disabledBoxCount === inputs.length - 1){
            let winn = inOut.findIndex((e) => {
                return e === "in" 
            })
            dispatchWinnerScreen(playing[winn])
        }
        //console.log(disabledBoxCount)
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
            curSkores: curSkores,
            seriesID: seriesID
        }

        
        const response = await fetch('http://192.168.1.16:5000/game/jackpot/round', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newGameObj)
        })
        const responseData = await response.json()
        //console.log(responseData)
        let newGameState = []
        
        responseData.playerNames.map((player, index) => {
            if(parseInt(responseData.skores[index]) >= 250){
                inputs[index].value = '250'
                //inputs[index].readonly = true
                
            }
            else{
                inputs[index].value = ''
            }
            let updatedPlayer = {
                name: player,
                id: responseData.playerIds[index],
                skore: responseData.skores[index]
            }
            newGameState.push(updatedPlayer)
        })
        let currentRound = gameRound
        setGameRound(currentRound+1)
        let nextDealer = playing.findIndex(p => {
            return p === dealer
            // return index of current dealer into next dealer
        })

        // Working Logic for players without out
        
        if(nextDealer < playing.length-1){
            nextDealer += 1
        }
        else{
            nextDealer = (nextDealer+1) % playing.length
        }
        //*/
        //console.log(nextDealer)
        setDealer(playing[nextDealer])
        setGameState(newGameState)
        
    }

    const configToggleHandler = () => {
        setConfig(false)
    }

    const onChangeDealerUpdateHandler = (e) => {
        setDealer(e.target.value)
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
                    <label><b>add player: </b></label><input ref={newPlayerNameInputRef} type='text' className="game-input1" autocapitalize="off"  ></input>
                    <label><b>dealer: </b></label><input ref={dealerInputRef} type='text' className="game-input1" autocapitalize="off" onChange={onChangeDealerUpdateHandler} ></input>
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
                <div className="new_game_form_div">
                    
                    <label><b>dealer: </b></label><input ref={dealerInputRef} type='text' className="game-input1" autocapitalize="off" onChange={onChangeDealerUpdateHandler} ></input>
                    <button className="game-button" onClick={configToggleHandler}>START</button>
                    
                </div>
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
                        <h5 style={housefull}>{gang ? "usual" : "" } {seriesID}</h5>
                        <h5>game {gameRound} dealer: {dealer}</h5>
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
                const housefull = {
                    color: '#666666'
                }
            if(winner===null){
                return (
                    //dynamic team block render
                    <div className="game-container">
                        <div className="game">
                        <h3>Jackpot {stakes}</h3>
                        <h5 style={housefull}>{seriesID}</h5>
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
            else{
                return(
                    
                    <div className="game-container">
                        <div className="game">
                        <h3>Jackpot {stakes}</h3>
                        <h5 style={housefull}>{seriesID}</h5>
                        <div className="result">
                            <h4 className="round_num">end of series</h4>
                            <h2>winner is {winner}</h2>
                        </div>
                            
                        </div>
                    </div>
                )

            }
                
                
            }
            
        }
        //setGameState(dynGameState)
        
    }
    
}

export default Jackpot;