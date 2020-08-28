import React, { useState } from 'react';
import './PlayersList.css'
import PlayerItem from './PlayerItem'

const PlayersList = props => {

    const [selected, setSelected] = useState(false)


    if(props.player_items.length === 0){
        return (
            <div className='center'>
                <h2>no players found</h2>
            </div>
        );
    }
    return (
        <ul className="players-ul">
            {props.player_items.map(player => (
                <PlayerItem 
                    key={player.id}
                    id={player.id} 
                    name={player.name} 
                    swins={player.swins}
                    splayed={player.splayed}
                    mwins={player.mwins}
                    isChecked={selected}
                />
            ))}
        </ul>
    );
};


export default PlayersList;