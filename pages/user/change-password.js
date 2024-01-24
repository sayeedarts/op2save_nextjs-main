import React, { useEffect, useState } from 'react'

// Next Js Extn
import { useRouter } from 'next/router'
import Head from 'next/head'

// Plugins
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useFormik } from 'formik';

// Componenets
import axios from '../../services/axios'
import { check_login, user_data, set_storage, clear_user_data } from '../../services/helper'
import UserBlock from '../../components/User/UserBlock';
import Header from '../../components/Layouts/Header'
import Footer from '../../components/Layouts/Footer';
import Breadcrumb from '../../components/User/Breadcrumb'
import InputErrorDiv from '../../components/Common/InputErrorDiv';

const ChangePassword = () => {
    const pageTitle = "User Profile"
    const router = useRouter()
    const notify = (status, message) => {
        status == 1 ? toast.success(message) : toast.error(message)
    };

    const [userData, setUserData] = useState({
        old_password: "",
        password: "",
        reenter_password: ""
    });
    // const history = useHistory();
    useEffect(() => {
        if (check_login() == 0) {
            router.push('/auth/login')
        }
    }, [])


    const formik = useFormik({
        initialValues: userData,
        enableReinitialize: true,
        onSubmit: (values, {resetForm}) => {
            updatePassword(values)
            resetForm();
        },
        validate: values => {
            let errors = {}
            if (!values.old_password) {
                errors.old_password = "Old Password is required"
            }
            if (!values.password) {
                errors.password = "New Password is required"
            }
            if (!values.reenter_password) {
                errors.reenter_password = "Re-enter Password is required"
            }
            if (values.reenter_password !== values.password) {
                errors.password = "New password and Re-enter password not matching"
                errors.reenter_password = "Not Matching"
            }
            return errors
        }
    })

    const updatePassword = async (values) => {
        const userEmail = user_data('email')
        const request_payload = JSON.stringify({
            email: userEmail,
            old_password: values.old_password,
            password: values.password,
        });
        const initApi = await axios.post('user/password', { data: request_payload })
        const getResponse = await initApi.data
        if (getResponse.status == 1) {
            notify(getResponse.status, getResponse.message)
        }
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
                                    <h3 className="mb-3">Change Password</h3>
                                    {
                                        Object.keys(formik.errors).length > 0 ?
                                            <div className='alert alert-warning'>Please Provide Required Details</div>
                                            : ''
                                    }
                                    <form className="form" onSubmit={formik.handleSubmit} autoComplete='OFF'>
                                        <div className="row">
                                            <div className="col-sm-4">
                                                <h6 className="mb-0">Current Password *</h6>
                                            </div>
                                            <div className="col-sm-8 text-secondary">
                                                <input type="password" name="old_password" id="old_password" className="form-control" value={formik.values.old_password} onChange={formik.handleChange} onBlur={formik.handleBlur} />
                                                {formik.touched.old_password && formik.errors.old_password ? <div className="text-danger">{formik.errors.old_password}</div> : null}
                                            </div>
                                        </div>
                                        <hr />
                                        <div className="row">
                                            <div className="col-sm-4">
                                                <h6 className="mb-0">New Password *</h6>
                                            </div>
                                            <div className="col-sm-4 text-secondary">
                                                <input type="password" name="password" id="password" className="form-control" value={formik.values.password} onChange={formik.handleChange} onBlur={formik.handleBlur} />
                                                <small>Provide a valid password</small>
                                                {formik.touched.password && formik.errors.password ? <div className="text-danger">{formik.errors.password}</div> : null}
                                            </div>
                                            <div className="col-sm-4 text-secondary">
                                                <input type="password" name="reenter_password" id="reenter_password" className="form-control" value={formik.values.reenter_password} onChange={formik.handleChange} onBlur={formik.handleBlur} />
                                                <small>Re enter the password again</small>
                                                {formik.touched.reenter_password && formik.errors.reenter_password ? <div className="text-danger">{formik.errors.reenter_password}</div> : null}
                                            </div>
                                        </div>
                                        <hr />

                                        <hr />
                                        <div className="row">
                                            <div className="col-sm-12">
                                                <input type="submit" className="btn btn-md instant_btn hvr-bounce-to-right" value="Update Password " />
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

export default ChangePassword
