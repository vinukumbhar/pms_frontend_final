import React, { useState } from 'react'
import Switch from "react-switch";
const LoginSwitch = () => {
    const [loginSwitch, setLoginSwitch] = useState(false);
    const handleLoginChange = (checked) => {
        setLoginSwitch(checked)
    }
    return (

        <div>
            <Switch
                onChange={handleLoginChange}
                checked={loginSwitch}
                onColor="#3A91F5"
                onHandleColor="#FFF"
                handleDiameter={20}
                uncheckedIcon={false}
                checkedIcon={false}
                height={25}
                width={45}
                className="react-switch"
            />
        </div>
    )
}

export default LoginSwitch