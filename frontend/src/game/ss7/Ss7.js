import React, { useState } from 'react';
import './Ss7.css';
import PlayersList from '../../shared/components/PlayersList';
import PLAYERS from '../../shared/LocalPlayers';
import Ss7R from './Ss7R';


const Ss7 = () => {
    const [selected, setSelected] = useState(null)
    const [ showRun, setShowRun ] = useState(false)
    

    const beginSs7 = event => {
        event.preventDefault();
        setSelected({
            pl: [ "acetone7", "babykris", "baby" ]
        })
        setShowRun(true)
    };
    if(showRun === false){
        return (
            <div className="game-container">
                <div className="game">
                    <h3>ss7</h3>
                    <h5>Add Players</h5>
                    <h4>{selected}</h4>
                    <form onSubmit={beginSs7}>
                    <PlayersList player_items={PLAYERS}/>
                    <button 
                    className="game-button"
                    type="submit"
                    >
                    START
                    </button>
                    </form>
                </div>
            </div>
         
        );
    }
    else{
        const plaa = selected.pl
        return (
            <div className="game-container">
                <div className="game">
                    <h3>ss7</h3>
                    <Ss7R selected={plaa}/>
                </div>
            </div>
        )
    }
    
};

export default Ss7;