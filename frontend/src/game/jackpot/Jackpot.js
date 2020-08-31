import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios'

import './Jackpot.css'

import Gamer from '../../shared/components/Gamer'
import PLAYERS from '../../shared/LocalPlayers';

const Jackpot = (props) => {

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



    const newPlayerNameInputRef = useRef(null)
    const dealerInputRef = useRef(null)


    useEffect(() => {
        // retrieves the SERIES CODE for current series 
        // and sets the series id
        let salt
        axios.get('http://ckr.is:5000/game/jackpot/code')
            .then(response => {
                // REMOVE BEFORE PROD console.log
                console.log(response.data.code)
                salt = response.data.code
                setSeriesId(salt)
            })
    },[])



    useEffect(() => {
        // everytime a player is added to playing array sets the focus back to input
        if(config){
            newPlayerNameInputRef.current.focus()
            newPlayerNameInputRef.current.click()
        }
        
    },[playing])

    useEffect(() => {
        console.log("dealer index: ",dealerIndex)
        console.log("opener index: ",openerIndex)
    },[dealerIndex, openerIndex])




  

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
        setDealer(dealerInputRef.current.value)
        let firstDealerIndex = playing.findIndex(p => {
            return p===dealer
        })
        setDealerIndex(firstDealerIndex)
        let firstOpenerIndex 
        if(firstDealerIndex < playing.length - 1){
            firstOpenerIndex = firstDealerIndex + 1
        }
        else{
            firstOpenerIndex = 0
        }
        setOpenerIndex(firstOpenerIndex)
        let inputs = document.getElementsByName('skore_input')
        const response = await fetch('http://ckr.is:5000/game/jackpot/init', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                playerNames: playing,
                stakes: stakes,
                seriesID: seriesID,
                dealer: dealer

            })
        })
        const responseData = await response.json()
        setOpen(responseData.opener)
        
        setGameState(responseData.gameState)
        setConfig(false)
        inputs[0].focus()
        inputs[0].click()
        //console.log("dealer index first ",dealerIndex)
    }


    // Function for adding players into playing array
    // ==============================================
    const addPlayerHandler = (e) => {
        e.preventDefault()
        
        if( dealerInputRef.current.value === '' || dealerInputRef.current.value === null){
            dealerInputRef.current.value = newPlayerNameInputRef.current.value
        } 
        setDealer(dealerInputRef.current.value)


        let currentPlaying = []
        if(playing !== null){
            currentPlaying = [...playing]
        }
        currentPlaying.push(newPlayerNameInputRef.current.value)
        setPlaying(currentPlaying)
        newPlayerNameInputRef.current.value = ''
        newPlayerNameInputRef.current.click()
        newPlayerNameInputRef.current.focus()
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

        const response = await fetch('http://ckr.is:5000/game/jackpot/round', {
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
        // Here im doing a primitive front push of the dealer 
        // whereas i want to do a sort of 
        // get the current opener
        // find out who the next opener should be from new playing with the
        // primitive front push
        // then fix the next dealer as one behind the next opener from new playing array
        // this should be cool ...
        let currentOpenerIndex = playing.findIndex(p => {
            return p === opener
        })
        if(currentOpenerIndex > -1){

            if(currentOpenerIndex < playing.length - 1){
                currentOpenerIndex += 1
            }
            else{
                currentOpenerIndex = 0
            }
        }
        else{
            //currentOpenerIndex = 
        }
        
        
        
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
        for(let x=0; x<inputs.length; x++){
            inputs[x].value = ''
        }
        inputs[0].focus()
        inputs[0].click()

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
                
        
                <div className="new_game_form_div">
                    <label><b>add player: </b></label><input ref={newPlayerNameInputRef} type='text' className="game-input1" autocapitalize="off"  ></input>

                    <label><b>dealer: </b></label><input ref={dealerInputRef} type='text' className="game-input1" autocapitalize="off" onChange={onChangeDealerUpdateHandler} ></input>

                    <button className="game-button" onClick={addPlayerHandler}>ADD</button>
                    <button className="game-button" onClick={newGameGenerateHandler}>START</button>
                </div>
               
                {playing === null ?
                    null 
                    :
                    
                    playing.map((p, index) => {
                        return (
                            <span style={style}>{p} </span>
                        )
                    })

                }
                 
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
