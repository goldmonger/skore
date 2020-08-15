import React, { useState } from 'react';
import './Jackpot.css'

import Gamer from '../../shared/components/Gamer'

const Jackpot = (props) => {

    let AllPlayerNames = []
    props.all_players.map(player => {
        AllPlayerNames.push(player.name)
    })
    let roundSkoresList = []
    props.all_players.map(player => {
        roundSkoresList.push({id: player.id, skore: 0})
    })

    const [ gang, setGang ] = useState(false)
    const [ stakes, setStakes ] = useState(100)
    const [ config, setConfig ] = useState(true)
    const [ gameRound, setGameRound ] = useState(1)
    const [ gameState, setGameState ] = useState(props.all_players)
    const [ playing, setPlaying ] = useState(AllPlayerNames)
    const [ roundSkores, setRoundSkores ] = useState([roundSkoresList])


    const gangFlagHandler = () => {
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

    const beginJackpotHandler = (e) => {
        setConfig(false)
        if(gang === true){
            //all 5 render
            /*
            props.all_players.map(player => {
                //console.log(player.name)
            })
            */
           setPlaying(AllPlayerNames)
           //console.log(AllPlayerNames)
        }
        else{
            let tempArray = []
            let newPlayingState = []
            //render only the first 3 players from jackpot
            props.all_players.map(player => {
                tempArray.push(player.name)
            })
            let x = 0
            for(x; x<3; x++){
                //console.log(tempArray[x])
                newPlayingState.push(tempArray[x])

            }
            setPlaying(newPlayingState)
        }
    }

    const addToSkoreHandler = (e, id) => {
        const playerIndex = gameState.findIndex(p => {
            return p.id === id
        })
        const player = {
            ...gameState[playerIndex]
        }
        //let originalSkore = player.skore
        //originalSkore = originalSkore + e.target.value
        const players = [...gameState]
        players[playerIndex] = player 
        console.log(player)
        console.log(id)
        console.log(e.target.value)
        setGameState(players)
    }

    const onRoundSubmitHandler = (e) => {
        e.preventDefault()
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
                <button value="reset" onClick={gangFlagHandler} className="game_flag_button">reset</button>
                :
                <button value="set" onClick={gangFlagHandler} className="game_flag_button" >set</button>
                }
                <button className="game-button" onClick={beginJackpotHandler}>START</button>
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
                //usual team block render
                <div className="game-container">
                    <div className="game">
                    <h3>Jackpot {stakes}</h3>
                    <h5>game {gameRound}</h5>
                        <div className="game-container">
                        <form onSubmit={onRoundSubmitHandler}>
                            {
                                props.all_players.map((player, index) => {
                                    if (index < 3){
                                        //render the player
                                        return (
                                            <Gamer 
                                            key={player.id}
                                            id={player.id} 
                                            name={player.name} 
                                            skore={gameState[index].skore}
                                            />
                                        )
                                    }
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