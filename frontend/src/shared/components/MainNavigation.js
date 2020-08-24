import React, { useState } from 'react'

import Brand from '../../header/Brand'
import NavLinks from './NavLinks'
import SideDrawer from './SideDrawer'
import Backdrop from './Backdrop'
import './MainNavigation.css'

const MainNavigation = (props) => {
    const [ drawerOpen, setDrawerOpen ] = useState(false)

    const openDrawer = () => {
        setDrawerOpen(true)
    }

    const closeDrawer = () => {
        setDrawerOpen(false)
    }

    return (
        <React.Fragment>
        {drawerOpen && <Backdrop onClick={closeDrawer} />}
    
        <SideDrawer show={drawerOpen} onClick={closeDrawer} >
            <nav className="main_navigation__drawer-nav">
                <NavLinks />
            </nav>
        </SideDrawer>
        
        <Brand >
            <button className="main-navigation__menu-btn" onClick={openDrawer} >
                <span />
                <span />
                <span />
            </button>
            <nav className="main-navigation__header-nav">
                <NavLinks />
            </nav>
        </Brand>
        </React.Fragment>
    )
}

export default MainNavigation