import React from 'react';
import { BrowserRouter as Router, Route, Redirect, Switch, Link } from 'react-router-dom';
import logo from './logo.svg';
import './App.css';
import Ss7 from './game/ss7/Ss7';
import Jackpot from './game/jackpot/Jackpot';
import Signature from './Signature/Signature';
import JackpotPlayers from './game/jackpot/JackpotPlayers';
import Version from './Version/Version'


const App = () => {


  return (

    <Router>
    
      <Switch>
        <Route path="/game/ss7" exact>
          <div className="App">
            <header className="App-header">
              <div className="skore">
                  <span className="logo_skore" id="sk">sk</span>
                    <img src={logo} className="App-logo" alt="logo" />
                  <span className="logo_skore" id="re">re</span>
                  <sup><sup><Signature /></sup></sup>
              </div>             
            </header>
          </div>
          <Ss7 />
        </Route>
        <Route path="/game/jackpot" exact>
          <div className="App">
            <header className="App-header">
              <div className="skore">
                  <span className="logo_skore" id="sk">sk</span>
                    <img src={logo} className="App-logo" alt="logo" />
                  <span className="logo_skore" id="re">re</span>
                  <sup><sup><Signature /></sup></sup>
              </div>             
            </header>
          </div>
          <Jackpot all_players={JackpotPlayers}/>
          
        </Route>
        <Route path="/game/so-lo" exact>
          <div className="App">
            <header className="App-header">
              <div className="skore">
                <span className="logo_skore" id="sk">sk</span>
                  <img src={logo} className="App-logo" alt="logo" />
                <span className="logo_skore" id="re">re</span>
                <sup><sup><Signature /></sup></sup>
              </div>             
            </header>
          </div>
          
          
        </Route>

        <Route path="/" exact>
          <div className="App">
            <header className="App-header">
              <div className="skore">
                <span className="logo_skore" id="sk">sk</span>
                  <img src={logo} className="App-logo" alt="logo" />
                <span className="logo_skore" id="re">re</span>
                <sup><sup><Signature /></sup></sup>
              </div>   
              <code id="llm_original">Long Live Mark</code>
              <Version />
            </header>
            <div className="game-container">
              <h2 className='skore_title'> Pick a game</h2>
              <ul className="players_list">
                <Link to='/game/ss7'><li id="ss7_li_main">super cyka 7</li></Link>
                <Link to='/game/jackpot'><li id="jackpot_li_main">jackpot</li></Link>
                <Link to='/'><li id="solo_li_main">f</li></Link>
                
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
