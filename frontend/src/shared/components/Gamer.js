import React, { useState } from 'react'

import './Gamer.css'

const Gamer = props => {

    const green_ticks = document.getElementsByName('green_tick')
    console.log(green_ticks)
    


    return (
        <li className="game_list_item">
            <div className="game_list_item_div" id={props.id}>
                <h3 className="gamer_name">{props.name}</h3>
                <h4 className="cumulative_skore">total: <span style={{color: '#e3c43b', fontSize: '22px'}}>{props.skore}</span> </h4>

                <input 
                type="text" 
                //className="current_skore_input"
                className="game-input2"
                id={props.id} 
                name="skore_input"
                defaultValue={""}
                pattern="\d*"
                autocapitalize="off"
                
                />


                <img src={require("../res/green_tick_nowhite.png")} className="approval_icon" name="green_tick" style={{display: "none"}} />
            </div>
        </li>
    )
}

export default Gamer