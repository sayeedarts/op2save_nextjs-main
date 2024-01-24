import React, { Component, useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from "next/router";
import { check_login, user_data, set_storage, clear_user_data } from '../../services/helper'
import Menu from './Menu';

const Header = ({ settings, brand, services }) => {
	const { pathname } = useRouter();
	const [currentLink, setCurrentLink] = useState('home');
	const [state, setState] = useState({
		loggedIn: 0,
		userDashboard: {
			text: 'Login',
			url: '/auth/login'
		}
	})

	useEffect(() => {
		if (check_login() === 1) {
			setState({
				loggedIn: 1,
				userDashboard: {
					text: 'Dashboard',
					url: '/user/profile'
				}
			})
		}
	}, [])

	return (
		<>
			<header className="header">
				<div className="container">
					<div className="row">
						<div className="col-md-2 col-sm-12">
							<div className="logo">
								<Link href={'/'}>
									<a>
										{(() => {
											if (brand.logo && brand.name) {
												return(
													<img className='mt-1' src={brand.logo} title={brand.name}/>
												)
											} else {
												return(
													<img className='mt-1' src={'/assets/logo_white_bg.png'} />
												)
											}
										})()}
										
									</a>
								</Link>
								<label htmlFor="tm" id="toggle-menu"><i className="fa fa-bars"></i></label>
							</div>
						</div>
						<div className="col-md-8 col-sm-12">
							<Menu pathname={pathname} services={services} state={state} />
						</div>
						<div className="col-md-2 col-sm-12">
							<div className="calling_box">
								<div className="icon_mobile">
									<i className="fa fa-phone"></i>
								</div>
								<div className="number_box">
									<span>Click Here to Call us</span>
									<span><a href="tel:02075159347">0207 515 9347</a></span>
								</div>
							</div>
						</div>
					</div>
				</div>
			</header>
		</>
	)
}

export default Header
