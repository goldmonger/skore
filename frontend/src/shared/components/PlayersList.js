import React, { useState, useEffect } from 'react';
import './PlayersList.css'
import PlayerItem from './PlayerItem'

const PlayersList = props => {

    const [selected, setSelected] = useState([])
    useEffect(() => {
        props.submission(selected)
    },[selected])

    const toggleSelected = (e, name) => {
        let newSelected 
        if(e === 'true'){
            newSelected = [...selected, name]
        }
        else{
            newSelected = []
            selected.map(p => {
                if(p!==name){
                    newSelected.push(p)
                }
            })
        }
        setSelected(newSelected)
        //console.log(selected)
    }


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
                    isChecked={(e, name) => toggleSelected(e, name)}
                    selected={props.selected}
                />
            ))}
        </ul>
    );
};


export default PlayersList;