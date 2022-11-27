import React from 'react'
import { Link } from 'react-router-dom'
import IconButton from '@mui/material/IconButton'
import logo from '../../assets/benchmark.svg'
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline'
import CreateDialog from '../dialogs/createDialog'
import useStore from '../../services/useStore'
import './header.css'

const Header = () => {
  // state change to open the create dialog
  const openCreateDialog = useStore((state) => state.openCreateDialog)
  
  // JSX template
  return (
    <div className='header'>
      <div className='header-buttons-and-logo'>
        <Link to='/'>
          <img className='header-logo' height={60} src={logo} alt='logo' />
        </Link>

        <div className='header-buttons'>
          <IconButton className='header-button' aria-label='Add Setting' onClick={openCreateDialog}>
            <AddCircleOutlineIcon className='header-button-icon' />
          </IconButton>
        </div>
        <CreateDialog />

      </div>
    </div>
  )
}

export default Header
