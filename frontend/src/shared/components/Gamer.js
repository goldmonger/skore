import React, { useState } from 'react'

import './Gamer.css'

const Gamer = props => {

    return (
        <li className="game_list_item">
            <div className="game_list_item_div" id={props.id}>
                <h3 className="gamer_name">{props.name}</h3>
                <h4 className="cumulative_skore">total: {props.skore} </h4>

                <input 
                type="text" 
                className="current_skore_input"
                id={props.id} 
                name="skore_input"
                defaultValue={""}
                pattern="\d*"
                //onfocus clear input using refs somehow
                //onChange={props.changed}//display gray icon here
                //idk when but when the players approve the skore we make their icon go green sync
                />

                <img src={require("../res/green_tick_nowhite.png")} className="approval_icon" />
            </div>
        </li>
    )
}

export default Gamer