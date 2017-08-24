import React, { Component } from 'react';
import { Navbar, NavItem, Nav } from 'react-bootstrap';

class Header extends Component {
    render(){
        return(
           <Navbar fixedTop={true} inverse collapseOnSelect style={{ borderRadius: 0 }} >
                <Navbar.Header>
                    <Navbar.Brand>
                        <a>I Don't Know</a>
                    </Navbar.Brand>
                    <Navbar.Toggle />
                </Navbar.Header>
                <Navbar.Collapse>
                    <Nav pullRight>
                        <NavItem eventKey={1} href="#">Username</NavItem>
                        <NavItem eventKey={2} href="#">Logout</NavItem>
                    </Nav>
                </Navbar.Collapse>
            </Navbar>
        )
    }
}

export default Header
