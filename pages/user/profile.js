import React, { useEffect, useState } from 'react'

// Next Js Extn
import { useRouter } from 'next/router'
import Head from 'next/head'

// Plugins
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useFormik } from 'formik';
import * as Scroll from 'react-scroll';

// Componenets
import axios from '../../services/axios'
import { check_login, user_data, set_storage, clear_user_data } from '../../services/helper'
import UserBlock from '../../components/User/UserBlock';
import Breadcrumb from '../../components/User/Breadcrumb'
import InputErrorDiv from '../../components/Common/InputErrorDiv'

// user/details
const Profile = (props) => {
    const pageTitle = "User Profile"
    const router = useRouter()
    var scroll = Scroll.animateScroll;
    const notify = (status, message) => {
        status == 1 ? toast.success(message) : toast.error(message)
    };
    const [userData, setUserData] = useState({
        address: "",
        created_at: "",
        email: "tanmaya@gmail.com",
        email_verified_at: "",
        is_active: 0,
        mobile: "",
        name: "Tanmaya",
        postcode: "",
        profile_photo_path: "",
        profile_photo_url: "",
    });
    // const history = useHistory();
    useEffect(() => {
        if (check_login() == 0) {
            router.push('/auth/login')
        }
        // Get User data from API
        getUserDetails(user_data());

        scroll.scrollToTop();
    }, [])

    const getUserDetails = async (data) => {
        const initApi = await axios.post('user/details', {
            email: data.email
        })
        const getResponse = await initApi.data;
        if (getResponse.status === 1) {
            setUserData(getResponse.data);
        } else {
            // no relevant user exists
            clear_user_data();
            router.push('/auth/login')
        }
    }

    const formik = useFormik({
        initialValues: userData,
        enableReinitialize: true,
        onSubmit: values => {
            updateUserData(values);
        },
        validate: values => {
            let errors = {}
            if (!values.name || values.name.length > 200) errors.name = "Name is Invalid"
            if (!values.email || values.email.length > 200) errors.email = "Email is Invalid"
            if (!values.mobile || values.mobile.length > 15) errors.mobile = "Mobile number is Invalid"
            if (!values.address || values.address.length > 5000) errors.address = "Address is Invalid"
            if (!values.postcode || values.postcode.length > 20) errors.postcode = "Postcode is Invalid"
            return errors
        }
    })

    const updateUserData = async (values) => {
        const request_payload = JSON.stringify(values);
        const anchorCol = user_data('email')
        const initApi = await axios.post('user/update', { data: request_payload, anchor: anchorCol })
        const getResponse = await initApi.data
        if (getResponse.status === 1) {
            notify(getResponse.status, getResponse.message)
            set_storage('user', JSON.stringify(values))
            router.push('/user/profile')
        }
    }

    const handleLogout = () => {
        clear_user_data();
        router.push('/auth/login')
    }

    return (
        <>
            <Head>
                <title> {pageTitle} </title>
                <link rel="stylesheet" href="/css/user-profile.css" />
            </Head>
            <section id="user-profile">
                <div className="container mb-4">
                    <Breadcrumb activeMenu={'user-profile'} title={pageTitle} />
                </div>
                <div className='container'>
                    <div className="row gutters-sm animate__animated-X animate__fadeInUp_X">
                        <UserBlock activeMenu={'user-profile'} />
                        <div className="col-md-9">
                            <div className="card mb-3">
                                <div className="card-body">
                                    <h3 className="mb-3">Profile Details</h3>
                                    <form className="form" onSubmit={formik.handleSubmit}>
                                        <div className="row">
                                            <div className="col-sm-3">
                                                <h6 className="mb-0">Full Name</h6>
                                            </div>
                                            <div className="col-sm-9 text-secondary">
                                                <input type="text" name="name" id="name" className="form-control" value={formik.values.name} onChange={formik.handleChange} onBlur={formik.handleBlur} placeholder="e.g. John Doe"/>
                                                <InputErrorDiv formik={formik} elm={'name'} />
                                            </div>
                                        </div>
                                        <hr />
                                        <div className="row">
                                            <div className="col-sm-3">
                                                <h6 className="mb-0">Email</h6>
                                            </div>
                                            <div className="col-sm-9 text-secondary">
                                                <input type="email" name="email" id="email" className="form-control" value={formik.values.email} onChange={formik.handleChange} onBlur={formik.handleBlur} readOnly={true}/>
                                                <div className="text-info">You cannot change the Email Address</div>
                                                <InputErrorDiv formik={formik} elm={'email'} />
                                            </div>
                                        </div>
                                        <hr />
                                        <div className="row">
                                            <div className="col-sm-3">
                                                <h6 className="mb-0">Phone</h6>
                                            </div>
                                            <div className="col-sm-9 text-secondary">
                                                <input type="mobile" name="mobile" id="mobile" className="form-control" value={formik.values.mobile} onChange={formik.handleChange} onBlur={formik.handleBlur} placeholder="e.g +441234567890"/>
                                                <InputErrorDiv formik={formik} elm={'mobile'} />
                                            </div>
                                        </div>
                                        <hr />
                                        <div className="row">
                                            <div className="col-sm-3">
                                                <h6 className="mb-0">Address</h6>
                                            </div>
                                            <div className="col-sm-9 text-secondary">
                                                <input type="address" name="address" id="address" className="form-control" value={formik.values.address} onChange={formik.handleChange} onBlur={formik.handleBlur} placeholder="e.g. S G Stores, RUNCORN, WA7 5LY"/>
                                                <InputErrorDiv formik={formik} elm={'address'} />
                                            </div>
                                        </div>
                                        <hr />
                                        <div className="row">
                                            <div className="col-sm-3">
                                                <h6 className="mb-0">Post Code</h6>
                                            </div>
                                            <div className="col-sm-9 text-secondary">
                                                <input type="postcode" name="postcode" id="postcode" className="form-control" value={formik.values.postcode} onChange={formik.handleChange} onBlur={formik.handleBlur} placeholder="e.g. SG120XS" />
                                                <InputErrorDiv formik={formik} elm={'postcode'} />
                                            </div>
                                        </div>
                                        <hr />
                                        <div className="row">
                                            <div className="col-sm-12">
                                                <input type="submit" className="btn btn-md instant_btn hvr-bounce-to-right" value="Update Details" />
                                            </div>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <ToastContainer
                position="bottom-right"
                theme={'colored'}
            />
        </>
    )
}

export default Profile
