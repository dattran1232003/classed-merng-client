import React, { useContext, useState, useEffect } from 'react'
import { Menu } from 'semantic-ui-react'
import { Link } from 'react-router-dom'

import { AuthContext } from '../context/auth'

function MenuBar() {
  const pathname = window.location.pathname
  const { user, logout } = useContext(AuthContext)
  const path = pathname === '/' ? 'home' : pathname.substr(1)
  const [activeItem, setActiveItem] = useState(path)

  useEffect( () => setActiveItem(path), [path])
  const handleItemClick = (_, { name }) => setActiveItem(name) 

  const menuBar = user ? (
      <Menu pointing secondary size="massive" color="teal">
        <Menu.Item 
          name={user.username}
          active
          as={Link} to="/"
        />

        <Menu.Menu position='right'>
          <Menu.Item 
            name='logout' 
            onClick={logout}
            as={Link} to="/login"
          />
        </Menu.Menu>
      </Menu>

  ) : (
      <Menu pointing secondary size="massive" color="teal">
        <Menu.Item 
          name="home"
          active={activeItem === 'home'}
          onClick={handleItemClick}
          as={Link} to="/"
        />

        <Menu.Menu position='right'>
          <Menu.Item 
            name='login' 
            active={activeItem === 'login'}
            onClick={handleItemClick}
            as={Link} to="/login"
          />
          </Menu.Menu>
          <Menu.Item 
            name='register' 
            active={activeItem === 'register'}
            onClick={handleItemClick}
            as={Link} to="/register"
          />
        </Menu>
  )

    return menuBar
}

export default MenuBar