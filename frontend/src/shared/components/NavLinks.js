import React from 'react'
import { NavLink } from 'react-router-dom'

import './NavLinks.css'

const NavLinks = (props) => {
    return (
        <ul className="nav-links">
            <li>
                <NavLink exact to="/">Home</NavLink>
            </li>
            <li>
                <NavLink exact to="/game/ss7">SS7</NavLink>
            </li>
            <li>
                <NavLink exact to="/game/jackpot">Jackpot</NavLink>
            </li>
            <li>
                <NavLink exact to="/game/solo">f</NavLink>
            </li>
        </ul>
    )
}

export default NavLinks
