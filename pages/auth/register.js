import React, { useState, useEffect } from 'react'
// Nextjs Extns
import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useFormik } from 'formik';
import axios from '../../services/axios'
import { icons } from '../../services/data'
import { set_storage, load_to_top as LTT } from '../../services/helper'
import Loading from '../../components/Common/Loading';

const Registration = (props) => {
    const [errors, setErrors] = useState([]);
    const [loading, setloading] = useState(0)
    const router = useRouter()
    const notify = (status, message) => {
        status == 1 ? toast.success(message) : toast.error(message)
    };
    useEffect(() => {
        LTT()
    }, [])
    const formik = useFormik({
        initialValues: {
            name: '',
            email: '',
            mobile: '',
            password: '',
            // confirm_pwd: ''
        },
        onSubmit: values => {
            // Call Api to Registration
            signupUser(values)

        },
        validate: values => {
            let errors = {}
            if (Object.keys(formik.errors).length > 0) {
            }
            if (!values.name) {
                errors.name = "Full name is Required"
            }

            if (!values.email) {
                errors.email = "Email address is Required"
            } else if (
                !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)
            ) {
                errors.email = 'Invalid Email address';
            }

            if (!values.password) {
                errors.password = "Password is Required"
            }
            // if (values.password != values.confirm_pwd) {
            //     errors.confirm_pwd = "Password & Confirm Password not matching"
            // }

            return errors
        }
    })

    /**
     * Registration with APi
     * @param {*} values Registration Data
     */
    const signupUser = async (values) => {
        setloading(1)
        const initApi = await axios.post('signup', values)
        const getResponse = await initApi.data
        if (getResponse.status == 1) {
            setErrors([])
            notify(getResponse.status, getResponse.message)
            router.push('/auth/login');
        } else if (getResponse.status == 0) {
            setErrors(getResponse.errors)
            notify(getResponse.status, getResponse.message)
        }
        setloading(0)
    }

    return (
        <>
            <Head>
                <title>User: Regitration</title>
                <link rel="stylesheet" href="/css/login.css" />
            </Head>
            <section id="login">
                <div className="container auth-page">
                    <div className="row py-5 mt-4 align-items-center">
                        {/* <!-- For Demo Purpose --> */}
                        <div className="col-md-5 pr-lg-5 mb-5 mb-md-0">
                            <img src={icons.register} alt="" className="img-fluid mb-3 d-none d-md-block" />
                            <h1>Create an Account</h1>
                            {/* <p className="font-italic text-muted mb-0">Create a minimal registeration page using Bootstrap 4 HTML form elements.</p>
                            <p className="font-italic text-muted">Snippet By <a href="https://bootstrapious.com" className="text-muted">
                                <u>Bootstrapious</u></a>
                            </p> */}
                        </div>

                        {/* <!-- Registeration Form --> */}
                        <div className="col-md-7 col-lg-6 ml-auto">
                            {loading === 1 ?
                                <Loading title={'Processing your Request, please wait.'} />
                                :
                                <form onSubmit={formik.handleSubmit}>
                                    <div className="row">
                                        {/* <!-- First Name --> */}
                                        <div className="input-group col-lg-12 mb-4">
                                            <div className="input-group-prepend">
                                                <span className="input-group-text bg-white px-4 border-md border-right-0">
                                                    <i className="fa fa-user text-muted"></i>
                                                </span>
                                            </div>
                                            <input id="firstName" type="text" name="name" placeholder="Full Name" className="form-control bg-white border-left-0 border-md" value={formik.values.name} onChange={formik.handleChange} onBlur={formik.handleBlur} />
                                            {formik.touched.name && formik.errors.name ?
                                                <div className="invalid-feedback" style={{ 'display': 'block' }}>
                                                    {formik.errors.name}
                                                </div>
                                                : null}
                                        </div>

                                        {/* <!-- Email Address --> */}
                                        <div className="input-group col-lg-12 mb-4">
                                            <div className="input-group-prepend">
                                                <span className="input-group-text bg-white px-4 border-md border-right-0">
                                                    <i className="fa fa-envelope text-muted"></i>
                                                </span>
                                            </div>
                                            <input id="email" type="email" name="email" placeholder="Email Address" className="form-control bg-white border-left-0 border-md" value={formik.values.email} onChange={formik.handleChange} onBlur={formik.handleBlur} />
                                            {formik.touched.email && formik.errors.email ?
                                                <div className="invalid-feedback" style={{ 'display': 'block' }}>
                                                    {formik.errors.email}
                                                </div>
                                                : null}
                                        </div>

                                        {/* <!-- Phone Number --> */}
                                        <div className="input-group col-lg-12 mb-4">
                                            <div className="input-group-prepend">
                                                <span className="input-group-text bg-white px-4 border-md border-right-0">
                                                    <i className="fa fa-phone-square text-muted"></i>
                                                </span>
                                            </div>
                                            {/* <select id="countryCode" name="countryCode" style={{ 'max-width': '80px' }} className="custom-select form-control bg-white border-left-0 border-md h-100 font-weight-bold text-muted">
                                        <option value="">+12</option>
                                        <option value="">+10</option>
                                        <option value="">+15</option>
                                        <option value="">+18</option>
                                    </select> */}
                                            <input id="phoneNumber" type="tel" name="phone" placeholder="Phone Number" className="form-control bg-white border-md border-left-0 pl-3-x" />
                                        </div>
                                        {/* <!-- Password --> */}
                                        <div className="input-group col-lg-12 mb-4">
                                            <div className="input-group-prepend">
                                                <span className="input-group-text bg-white px-4 border-md border-right-0">
                                                    <i className="fa fa-lock text-muted"></i>
                                                </span>
                                            </div>
                                            <input id="password" type="password" name="password" placeholder="Password" className="form-control bg-white border-left-0 border-md" value={formik.values.password} onChange={formik.handleChange} onBlur={formik.handleBlur} />
                                            {formik.touched.password && formik.errors.password ?
                                                <div className="invalid-feedback" style={{ 'display': 'block' }}>
                                                    {formik.errors.password}
                                                </div>
                                                : null}
                                        </div>

                                        {/* <!-- Submit Button --> */}
                                        <div className="form-group col-lg-12 mx-auto mb-0">
                                            <button type="submit" className="btn btn-md btn-block instant_btn hvr-bounce-to-right" disabled={Object.keys(formik.errors).length > 0 ? true : false}>
                                                <span className="font-weight-bold">Create your account</span>
                                            </button>
                                        </div>

                                        {/* <!-- Divider Text --> */}
                                        <div className="form-group col-lg-12 mx-auto d-flex align-items-center my-4">
                                            <div className="border-bottom w-100 ml-5"></div>
                                            <span className="px-2 small text-muted font-weight-bold text-muted">OR</span>
                                            <div className="border-bottom w-100 mr-5"></div>
                                        </div>
                                        {/* <!-- Already Registered --> */}
                                        <div className="text-center w-100">
                                            <p className="text-muted font-weight-bold">
                                                Already Registered?
                                                <Link href={'/auth/login'}>
                                                    <a className="text-primary ml-2 link">Login</a>
                                                </Link>
                                                {/* <span onClick={() => { set_storage('to_scroll', 1); props.history.push('/signin') }} className="text-primary ml-2 link">Login</span> */}
                                            </p>
                                        </div>

                                    </div>
                                </form>
                            }
                        </div>
                    </div>
                </div>
                {/* End of New Login Page */}
            </section>
        </>
    )
}

export default Registration
