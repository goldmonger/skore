import React from 'react';

import Gamer from '../components/Gamer'

const Game = props => {

    
    return (
        
            <ul className="game_table">
                {props.playing.map(player => (
                    <Gamer
                        key={player.id}
                        id={player.id}
                        name={player.name}
                        skore={player.skore}
                    />
                ))}
            </ul>
            

        
    );

};

export default Game;