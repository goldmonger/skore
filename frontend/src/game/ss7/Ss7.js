import React, { useState } from 'react'
import './Ss7.css'
import PlayersList from '../../shared/components/PlayersList'
import PLAYERS from '../../shared/LocalPlayers'
import Ss7R from './Ss7R'


const Ss7 = () => {
    const [selected, setSelected] = useState(null)
    const [ showRun, setShowRun ] = useState(false)
    
    const testFunc = (listSelected) => {
        console.log(listSelected)
        setSelected(listSelected)
    }

    const beginSs7 = (e) => {
        e.preventDefault()
        setShowRun(true)
    }
    if(showRun === false){
        return (
            <div className="game-container">
                <div className="game">
                    <h3>ss7</h3>
                    <h5>Add players in clockwise order</h5>
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
                    <Ss7R selected={selected}/>
                </div>
            </div>
        )
    }
    
}

export default Ss7;