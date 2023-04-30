import React from 'react'
import "../Good.css"
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import Button from '@mui/material/Button';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';


function Entity({ name, description, makeComplex }) {
  return (
    <div style={{
      backgroundColor: '#333',
      borderRadius: '10px',
      padding: '10px 20px',
      color: '#fff',
      marginBottom: "20px",
      maxWidth: "500px",
      minWidth: "400px"
    }}>
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h2 style={{ margin: '0' }}>{name}</h2>
          <AccountCircleIcon sx={{ fontSize: 45, marginLeft: '10px' }} />
        </div>
        <p style={{ textAlign: 'left' }}>{description}</p>
        {/* <div style={{ display: 'flex', alignItems: 'center' }}>
          <h3 style={{ margin: "0px 10px" }}>Input:</h3>
          <h3 style={{ background: "blue", padding: "5px 10px", borderRadius: "10px" }}>Other Entity</h3>
        </div> */}

        {makeComplex && (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>

            <div style={{ display: "flex", alignItems: "center" }}>
              <div class="content">
                <label class="checkBox">
                  <input id="ch1" type="checkbox" />
                  <div class="transition"></div>
                </label>
              </div>
              <p style={{ marginLeft: "15px" }}>Accurate</p>

            </div>

            {/* <FormControlLabel control={<Checkbox />} label="Task is correct" /> */}
            <Button sx={{ width: 100 }} variant="contained" component="label">
              Upload
              <input hidden accept="image/*" multiple type="file" />
            </Button>
          </div>
        )}
      </div>
    </div >
  )
}

export default Entity