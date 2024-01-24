import React, { useState } from 'react'

const StorageShortInfo = (props) => {
    const [activetab, setActivetab] = useState()
    const handleTabCLick = (id) => {
        props.chooseStorage(props.data.id)
        setActivetab(props.data.id)
    }

    return (
        <>
            <div
                className={"text-center size1" + (props.activeTab == props.data.id ? " active" : "")}
                onClick={() => handleTabCLick(props.data.id)}
            >
                {props.data.area}
                <p>{props.data.name}</p>
            </div>
        </>
    )
}

export default StorageShortInfo
