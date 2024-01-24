import React, { useEffect } from 'react'
import { icons } from '../../services/data'

const Loading = ({ title }) => {
    useEffect(() => {
        window.scrollTo(0, 0)
    }, [])
    return (
        <>
            <div className='row'>
                <div className='col-12 text-center'>
                    <p> {title} </p>
                    <img src={icons.loader} className='img-fluid' />
                </div>
            </div>
        </>
    )
}

export default Loading
