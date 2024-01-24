import React from 'react'
import { icons } from '../../services/data'

const NoRecordFound = ({title}) => {
    return (
        <>
            <div className="row">
                <div className="col-md-5 offset-md-4">
                    <img 
                        src={icons.online_shopping_laptop} 
                        className="img-fluid"
                    />
                    <h3 className="text-center">{title}</h3>
                </div>
                
            </div>
        </>
    )
}

export default NoRecordFound
