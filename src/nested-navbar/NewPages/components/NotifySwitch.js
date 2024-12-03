import React, { useState } from 'react'
import Switch from "react-switch";

const NotifySwitch = () => {
    const [notifySwitch, setNotifySwitch] = useState(false);
    const handleNotifyChange = (checked) => {
        setNotifySwitch(checked)
    }
  return (
    <div> <Switch
    onChange={handleNotifyChange}
    checked={notifySwitch}
    onColor="#3A91F5"
    onHandleColor="#FFF"
    handleDiameter={20}
    uncheckedIcon={false}
    checkedIcon={false}
    height={25}
    width={45}
    className="react-switch"
/></div>
  )
}

export default NotifySwitch