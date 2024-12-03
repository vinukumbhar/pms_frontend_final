import React, { useState } from 'react'
import Switch from "react-switch";

const EmailSync = () => {
 
    const [emailSyncSwitch, setEmailSyncSwitch] = useState(false);
    const handleEmailChange = (checked) => {
        setEmailSyncSwitch(checked)
    }
    return (

        <div>
            <Switch
                onChange={handleEmailChange}
                checked={emailSyncSwitch}
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

export default EmailSync