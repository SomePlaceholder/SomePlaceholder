import React, { useState } from 'react';
import {
  Navbar,
  Nav,
  DropdownButton,
  Dropdown,
  NavDropdown,
} from 'react-bootstrap';
import { Link, useHistory } from 'react-router-dom';
import styles from './Navbar.module.css';
import * as ROUTES from '../../constants/routes';
import { useAuth, signOut } from '../Firebase';

export function NavbarMod() {
  const { currentUser } = useAuth();
  const [show, setShow] = useState(false);
  const showDropdown = () => {
    setShow(!show);
  };
  const hideDropdown = () => {
    setShow(false);
  };

  const UserTile: React.FC = () => {
    const history = useHistory();
    const LoggedIn = () => (
      <DropdownButton
        style={{ marginRight: '60px' }}
        variant="secondary"
        title={currentUser?.displayName}
      >
        <Dropdown.Item as={Link} to={ROUTES.HOME}>
          Home
        </Dropdown.Item>
        <Dropdown.Item
          onClick={async () => {
            await signOut().then(() => {
              history.push(ROUTES.HOME);
            });
          }}
        >
          Log Out
        </Dropdown.Item>
      </DropdownButton>
    );

    const LoggedOut = () => (
      <Nav>
        <Navbar.Text as={Link} to={ROUTES.LOG_IN} className={styles.NavbarText}>
          Log In
        </Navbar.Text>
      </Nav>
    );

    return currentUser ? <LoggedIn /> : <LoggedOut />;
  };

  return (
    <Navbar className={styles.bar}>
      <Navbar.Toggle aria-controls="responsive-navbar-nav" />
      <Navbar.Brand as={Link} to="/">
        Something
      </Navbar.Brand>
      <NavDropdown
        title="Dropdown"
        id="collasible-nav-dropdown"
        show={show}
        onMouseEnter={showDropdown}
        onMouseLeave={hideDropdown}
      >
        <NavDropdown.Item
          as={Link}
          to={ROUTES.SQUARECOLORS}
          className={styles.NavbarText}
        >
          Square Colors
        </NavDropdown.Item>
      </NavDropdown>
      <Nav className="mr-auto" />
      <UserTile />
    </Navbar>
  );
}
