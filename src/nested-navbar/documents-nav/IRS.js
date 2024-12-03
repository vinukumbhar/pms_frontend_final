import React from 'react'
import { MdSettingsInputAntenna } from "react-icons/md";
import { Link } from 'react-router-dom';
const IRS = () => {
  return (
    <div style={{margin:'5% auto', textAlign:'center'}}>
      <MdSettingsInputAntenna style={{color:'grey', width:'100px', height:'100px',opacity:'0.5'}}/>
      <h3>You have no connected organizations</h3>
      <p>You have to connect organizations to request IRS transcripts</p>
      <Link to='https://la.www4.irs.gov/secureaccess/ui/?TYPE=33554433&REALMOID=06-0006787c-6ad2-12ca-aad1-7c2b0ad00000&GUID=&SMAUTHREASON=0&METHOD=GET&SMAGENTNAME=-SM-u0ktItgVFneUJDzkQ7tjvLYXyclDooCJJ7%2bjXGjg3YC5id2x9riHE98hoVgd1BBv&TARGET=-SM-HTTPS%3a%2f%2fla%2ewww4%2eirs%2egov%2fesrv%2fconsent%2foauth%3fclientId%3dae717e7c--03ee--41ef--bee2--4ff0e81ff36a%26env%3dLIVE'>
      <button className='btn1'>connect to IRS</button>
      </Link>
      
    </div>
  )
}

export default IRS