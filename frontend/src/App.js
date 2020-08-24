import React from 'react';
import { BrowserRouter as Router, Route, Redirect, Switch, Link } from 'react-router-dom';
//import logo from './logo.svg'
import './App.css'
import Ss7 from './game/ss7/Ss7'
import Jackpot from './game/jackpot/Jackpot'
import JackpotPlayers from './game/jackpot/JackpotPlayers'
import MainNavigation from './shared/components/MainNavigation'
import Brand from './header/Brand'


const App = () => {


  return (
    <Router>
      <MainNavigation />
      <Switch>
        <Route path="/game/ss7" exact>
          <div className="App">
            {//<Brand route="/ss7" />
            }
          </div>
          <Ss7 />
        </Route>
        <Route path="/game/jackpot" exact>
          <div className="App">
            
          </div>
          <Jackpot all_players={JackpotPlayers}/>
        </Route>
        <Route path="/game/solo" exact>
          <div className="App">
            <h5>long live mark</h5>
          </div> 
        </Route>
        <Route path="/" exact>
          <div className="App">
            {//<Brand route="/"/>
            }
            <div className="game-container">
                <h2 className='skore_title'> Pick a game</h2>
                <ul className="players_list">
                <Link to='/game/ss7'><li id="ss7_li_main">super cyka 7</li></Link>
                <Link to='/game/jackpot'><li id="jackpot_li_main">jackpot</li></Link>
                <Link to='/game/solo'><li id="solo_li_main">f</li></Link>
                </ul>
                <div style={{color: '#888888'}} id="disclaimer">
                    <code>Nothing belongs to <span style={{color: '#e3c43b'}}>poisoncandy</span> and its <br /><span style={{color: '#f28fc7'}}>designer</span>, all components belong to <br /><span style={{color: '#61dafb'}}>facebook.</span></code>
                </div>
            </div>   
          </div>  
        </Route>
        <Redirect to='/' />
      </Switch>
    </Router>
    
  );
}

export default App;
