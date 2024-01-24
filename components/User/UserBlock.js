import React, { useState, useEffect } from 'react'
import Sidebar from './Sidebar'
import { user_data, clear_user_data } from '../../services/helper'
// import { useHistory } from 'react-router-dom';
import { useRouter } from 'next/router'

const UserBlock = (props) => {
    const [userData, setUserData] = useState({});
    const router = useRouter();
    useEffect(() => {
        setUserData(user_data());
    }, [])

    const handleLogout = () => {
        clear_user_data();
        router.push('/auth/login')
    }

    return (
        <>
            <div className="col-md-3 mb-3-x">
                {/* <div className="card">
                    <div className="card-body">
                        <div className="d-flex flex-column align-items-center text-center">
                            <img src={`https://ui-avatars.com/api/?name=${userData.name}&color=7F9CF5&background=EBF4FF`} alt="profile photo" className="rounded-circle" width="150" />
                            <div className="mt-3">
                                <h4>{userData.name}</h4>
                                <p className="text-secondary mb-1">{userData.email} </p>
                                <p className="text-muted font-size-sm"> {userData.address} </p>
                                <button className="btn btn-danger" onClick={handleLogout}>
                                    <i className="fa fa-power-off"></i>
                                    &nbsp; Logout
                                </button>
                            </div>
                        </div>
                    </div>
                </div> */}
                <Sidebar activeMenu={props.activeMenu} />
            </div>
        </>
    )
}

export default UserBlock
