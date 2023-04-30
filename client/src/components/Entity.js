import React from 'react'
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import Button from '@mui/material/Button';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';


function Entity({ name, description, otherName }) {
  return (
    <div style={{
      backgroundColor: '#333',
      borderRadius: '10px',
      padding: '20px',
      color: '#fff',
      width: "500px",
      margin: "50px auto 0px auto"
    }}>
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h2 style={{ margin: '0' }}>{name}</h2>
          <AccountCircleIcon sx={{ fontSize: 45, marginLeft: '10px' }} />
        </div>
        <p style={{ textAlign: 'left', fontSize: '20px' }}>{description}</p>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <h3 style={{ margin: "0px 10px" }}>Input:</h3>
          <h3 style={{ background: "blue", padding: "5px 10px", borderRadius: "10px" }}>Other Entity</h3>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <FormControlLabel control={<Checkbox />} label="Task is correct" />
          <Button sx={{ width: 100 }} variant="contained" component="label">
            Upload
            <input hidden accept="image/*" multiple type="file" />
          </Button>
        </div>
      </div>
    </div >
  )
}

export default Entity