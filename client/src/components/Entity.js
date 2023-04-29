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
      width: "600px",
      margin: "50px auto 0px auto"
    }}>
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h1 style={{ margin: '0' }}>{name}</h1>
          <AccountCircleIcon sx={{ fontSize: 45, marginLeft: '10px' }} />
        </div>
        <p style={{ textAlign: 'left' }}>{description}</p>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <h2 style={{ margin: "0px 10px" }}>Input:</h2>
          <h2 style={{ background: "blue", padding: "5px 10px", borderRadius: "10px" }}>Other Entity</h2>
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