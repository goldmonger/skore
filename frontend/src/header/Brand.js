import React from 'react'
import { Link } from 'react-router-dom'
import Version from '../Version/Version'
import logo from '../logo.svg';
import Signature from '../Signature/Signature'
import './Brand.css'
//import '../App.css'

const Brand = (props) => {
    return (
        <header className="App-header">
            <Link to="/">
            <div className="skore">
                <span className="logo_skore" id="sk"><b>ck</b></span>
                <img src={logo} className="App-logo" alt="logo" />
                <span className="logo_skore" id="re"><b>rz</b></span>
                <sup><sup><Signature /></sup></sup> 
            </div>
            <Version />
            </Link>
            {props.children}
        </header>
    )
}
    /*
    if(props.route==="/"){
        return (
            <header className="App-header">
                {props.children}
                <div className="skore">
                    <span className="logo_skore" id="sk">ck</span>
                    <img src={logo} className="App-logo" alt="logo" />
                    <span className="logo_skore" id="re">rs</span>
                    <sup><sup><Signature /></sup></sup>
                </div>   
                {//<code id="llm_original">Long Live Mark</code>}
                }
                <Version />
                    
            </header>
        )
    }*/


    

export default Brand