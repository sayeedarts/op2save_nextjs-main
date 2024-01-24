import React, { useState, useEffect } from 'react'
// import { useHistory, useLocation } from 'react-router-dom';
import Link from 'next/link'
import { useRouter } from 'next/router'
import { user_data, clear_user_data } from '../../services/helper'

const Sidebar = (props) => {
    const router = useRouter();
    const { pathname } = useRouter();
    const [userData, setUserData] = useState({});
    // const location = useLocation();

    const [menu, setMenu] = useState('')
    const changePage = (e, name) => {
        e.preventDefault()
        router.push('/' + name)
    }

    useEffect(() => {
        // setMenu(location.pathname.replace(/^\/|\/$/g, ''))
        setUserData(user_data());
        return () => {
        }
    }, [])

    const handleLogout = () => {
        clear_user_data();
        router.push('/auth/login')
    }

    return (
        <>
            <div className="card mt-3-x">
                <ul className="list-group list-group-flush left-profile-sidebar">
                    <li
                        className={"list-group-item d-flex justify-content-between align-items-center flex-wrap " + (pathname == "/user/profile" ? 'active' : '')}
                    >
                        <Link href={'/user/profile'}>
                            <a>
                                <h6 className="mb-0"><i className="fa fa-user"></i> &nbsp; My Profile</h6>
                            </a>
                        </Link>
                    </li>
                    <li
                        className={"list-group-item d-flex justify-content-between align-items-center flex-wrap " + (pathname == "/user/address" ? 'active' : '')}
                    >
                        <Link href={'/user/address'}>
                            <a>
                                <h6 className="mb-0"><i className="fa fa-map-marker"></i> &nbsp; Manage Address</h6>
                            </a>
                        </Link>
                    </li>
                    {/* <li
                        className={"list-group-item d-flex justify-content-between align-items-center flex-wrap " + (pathname == "/user/change-password" ? 'active' : '')}
                    >
                        <a href="#" onClick={(e) => changePage(e, '/user/change-password')}>
                            <h6 className="mb-0"> <i className="fa fa-lock"></i> &nbsp;  Change Password</h6>
                        </a>
                    </li> */}
                    <li
                        className={"list-group-item d-flex justify-content-between align-items-center flex-wrap " + (pathname == "/user/quote-requests" ? 'active' : '')}
                    >
                        <Link href={'/user/quote-requests'}>
                            <a>
                                <h6 className="mb-0"><i className="fa fa-quote-right"></i> &nbsp; Quote Requests</h6>
                            </a>
                        </Link>
                    </li>
                    <li
                        className={"list-group-item d-flex justify-content-between align-items-center flex-wrap " + (pathname == "/user/orders/storage" ? 'active' : '')}
                    >
                        <Link href={'/user/orders/storage'}>
                            <a>
                                <h6 className="mb-0"><i className="fa fa-glass"></i> &nbsp; Storage Order</h6>
                            </a>
                        </Link>
                    </li>
                    <li
                        className={"list-group-item d-flex justify-content-between align-items-center flex-wrap " + (pathname == "/user/orders/packing" ? 'active' : '')}
                    >
                        <Link href={'/user/orders/packing'}>
                            <a>
                                <h6 className="mb-0"><i className="fa fa-archive"></i> &nbsp; Packing Materials</h6>
                            </a>
                        </Link>
                    </li>

                    <li
                        className="list-group-item d-flex justify-content-between align-items-center flex-wrap"
                    >
                        <a onClick={handleLogout}>
                            <h6 className="mb-0" style={{cursor: 'pointer'}}><i className="fa fa-power-off"></i> &nbsp; Log out</h6>
                        </a>
                    </li>
                </ul>
            </div>
        </>
    )
}

export default Sidebar
