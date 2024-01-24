import React, { useState, useEffect } from 'react'
import axios from '../../services/axios'

const Bottom = () => {
    const [master, setMaster] = useState([])
    useEffect(() => {
        const daat = getMasterData()


        return () => {
        }
    }, [])

    const getMasterData = async () => {
        const initApi = await axios.get('/site-settings')
        const getData = await initApi.data
        if (getData.status == 1) {
        }
    }

    return (
        <>
            Foter Section
        </>
    )
}

export default Bottom
