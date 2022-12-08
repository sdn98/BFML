import React from 'react'
import { useNavigate, Link } from 'react-router-dom';
import IconButton from '@mui/material/IconButton'
import logo from '../../assets/benchmark.svg'
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline'
import CreateSettingDialog from '../dialogs/settings-dialogs/create-setting-dialog'
import AutoAwesomeMotionOutlinedIcon from '@mui/icons-material/AutoAwesomeMotionOutlined';
import useStore from '../../services/useStore'
import './header.css'

const Header = () => {

  // state change to open the create dialog
  const openCreateSettingDialog = useStore((state) => state.openCreateSettingDialog)
 
  // navigation to utilities page (datasets and models)
  const navigate = useNavigate();
  const navigateToUtilities = () => {
    navigate('/utilities');
  };

  // JSX template
  return (
    <div className='header'>
      <div className='header-buttons-and-logo'>
        <Link to='/'>
          <img className='header-logo' height={60} src={logo} alt='logo' />
        </Link>

        <div className='header-buttons'>
          <IconButton className='header-button' aria-label='Add Setting' onClick={openCreateSettingDialog}>
            <AddCircleOutlineIcon className='header-button-icon' />
          </IconButton>
          <IconButton className='header-button' aria-label='Add Dataset' onClick={navigateToUtilities}>
            <AutoAwesomeMotionOutlinedIcon className='header-button-icon' />
          </IconButton>
        </div>
        <CreateSettingDialog />
      </div>
    </div>
  )
}

export default Header
