import React, { useState } from 'react';
import './PlayerItem.css';
import Switch from 'react-switch';




const PlayerItem = props => {
    const [state, setState] = useState({ checked: false});
    const handleChange = () => {
        if (state.checked === false){
            setState({checked: true})
            console.log("add " + props.id + " to selected")
            //how where is selected??
            
        }
        else{
            setState({checked: false})
            console.log("remove " + props.id + " from selected")
        }
    };

    return (
        //{/* here each li has to be made a separate component like a checkbox but highlight selected somehow */}
        <li className="player-item">
            <div className="player-item__content">
                <div className="player-item__slot">
                    <div className="player-item__info">
                        <h5> {props.splayed} series played </h5>
                        <h5> {props.swins} series won </h5>
                        <h5> {props.mwins} {props.mwins === 1 ? 'match won ' : 'matches won '}</h5>
                    </div>
                    <div className="player-item__select" id={props.id+"div"}>
                        <Switch
                            onChange={() => handleChange(props.id)}
                            checked={state.checked} 
                            handleDiameter={43}
                            height={50}
                            width={90}
                            uncheckedIcon={
                                <div></div>
                            }
                            onColor="#61dafb"
                            //onColor="#3ab4e0"

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