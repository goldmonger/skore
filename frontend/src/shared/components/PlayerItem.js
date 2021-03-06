import React, { useState } from 'react'
import './PlayerItem.css'
import Switch from 'react-switch'




const PlayerItem = props => {
    const [selected, setSelected] = useState(false);

    const handleChange = (name) => {
        if (selected === false){
            setSelected(true)
            //console.log("add " + props.id + " to selected")
            props.isChecked('true', name)
        }
        else{
            setSelected(false)
            //console.log("remove " + props.id + " from selected")
            props.isChecked('false', name)
        }
    };
    let poison 
    if(props.selected !== null){
        poison = props.selected.findIndex(p => {
            return p===props.name
        })
    }
    else{
        poison = null
    }
    
    return (
        <li className="player-item">
            <div className="player-item__content">
                <div className="player-item__slot">
                    <div className="player-item__info">
                        <h5> {props.splayed} series played </h5>
                        <h5> {props.swins} series won </h5>
                        <h5> {props.mwins} {props.mwins === 1 ? 'match won ' : 'matches won '}</h5>
                        <p className="poisonTracker"><b>{poison + 1}</b></p>
                    </div>
                    <div className="player-item__select" id={props.id+"div"}>
                        <Switch
                            onChange={() => handleChange(props.name)}
                            checked={selected} 
                            handleDiameter={43}
                            height={50}
                            width={90}
                            uncheckedIcon={
                                <div></div>
                            }
                            onColor="#61dafb"

                        />
                    </div>
                    
                </div>
                <div className="player-item__name">
                    <h3>{props.name}</h3>
                </div>
                
            </div>
        </li>
    );
};


export default PlayerItem;