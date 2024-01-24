import React, { useState, useEffect } from 'react'
// Nextjs Extns
import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useFormik } from 'formik';
import axios from '../../services/axios'
import { encrypt, set_storage } from '../../services/helper'
import { icons } from '../../services/data'
import Loading from '../../components/Common/Loading';

import OtpInput from 'react-otp-input';

const Login = (props) => {
    const router = useRouter();
    const [loading, setloading] = useState(0)
    // const [logged, setLogged] = useState(0)
    const [errors, setErrors] = useState([]);
    const notify = (status, message) => {
        status == 1 ? toast.success(message) : toast.error(message)
    };

    const [otp, setOtp] = useState('')
    const handleOtpChange = otp => {
        setOtp(otp);
        formik.values.otp = otp
    }

    useEffect(() => {
    }, [])

    const [showOtp, setShowOtp] = useState(0)
    const [loginBtn, setLoginBtn] = useState("Get Security Code")
    const formik = useFormik({
        initialValues: {
            email: '',
        },
        onSubmit: values => {
            // Call Api to Registration
            if (showOtp === 0) checkOtp(values)
            if (showOtp === 1) signinUser(values)
        },
        validate: values => {
            let errors = {}

            // Validate Email
            if (!values.email) {
                errors.email = "Email address is Required"
            } else if (
                !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)
            ) {
                errors.email = 'Invalid email address';
            }
            if (showOtp === 1 && !values.otp) {
                errors.otp = "Please fillup Security Code"
            }
            return errors
        }
    })

    const checkOtp = async (values) => {
        setloading(1)
        const request_payload = encrypt(JSON.stringify({
            email: values.email
        }));
        const initApi = await axios.post('otp-send', { data: request_payload })
        const getResponse = await initApi.data
        if (getResponse.status == 1) {
            setShowOtp(1)
            enableResendBtn()
            setLoginBtn("Login with Security Code")
        }
        notify(getResponse.status, getResponse.message)
        setloading(0)
    }

    /**
     * Login User with APi
     * @param {*} values Registration Data
     */
    const signinUser = async (values) => {
        setloading(1)
        const request_payload = encrypt(JSON.stringify({ ...values, otp: parseInt(otp) }));
        const initApi = await axios.post('otp-login', { data: request_payload })
        const getResponse = await initApi.data
        if (getResponse.status == 1) {
            setShowOtp(0)
            // User Login was Success
            // Set User's Print in Local Storage
            // setLogged(1)
            set_storage('is_logged', 1)
            set_storage('token', getResponse.token)
            set_storage('user', JSON.stringify(getResponse.user))
            // Reset Errors Object
            setErrors([])
            // notify(getResponse.status, getResponse.message)
            // Redirect to User Page
            router.push('/user/profile');
        } else if (getResponse.status == 0) {
            // setLogged(0)
            setErrors(getResponse.message)
            notify(getResponse.status, getResponse.message)
        }
        setloading(0)
    }

    /**
     * Enable/Disable Retry button after 30secs
     */
    const [showRetryOtp, setShowRetryOtp] = useState(0)
    const enableResendBtn = () => {
        setTimeout(function () {
            setShowRetryOtp(1)
        }, 30000);
    }

    /**
     * Trigger retry API
     */
    const handleResendOtp = () => {
        checkOtp({ email: formik.values.email })
        setShowRetryOtp(0)
    }


    return (
        <>
            <Head>
                <title>User: Login</title>
                <link rel="stylesheet" href="/css/login.css" />
            </Head>
            <section id="login">
                <div className="container auth-page">
                    <div className="row py-5 mt-4 align-items-center">
                        {/* <!-- For Demo Purpose --> */}
                        <div className="col-md-8 text-center">
                            <img src={icons.login} alt="" className="px-5 img-fluid mb-3 d-none d-md-block" />
                            <h1>Easy Login with Security Code</h1>
                            {/* <p className="font-italic text-muted mb-0">Create a minimal registeration page using Bootstrap 4 HTML form elements.</p>
                            <p className="font-italic text-muted">Snippet By <a href="https://bootstrapious.com" className="text-muted">
                                <u>Bootstrapious</u></a>
                            </p> */}
                        </div>

                        {/* <!-- Registeration Form --> */}
                        <div className="col-md-4 m-l-auto">
                            {loading === 1 ?
                                <Loading title={'Processing your Request, please wait.'} />
                                :
                                <form onSubmit={formik.handleSubmit} className="needs-validation" autoComplete='OFF' noValidate>
                                    <div className="row">
                                        {/* <!-- Email Address --> */}
                                        <div className="input-group col-lg-12 mb-4">
                                            <div className="input-group-prepend">
                                                <span className="input-group-text bg-white px-4 border-md border-right-0">
                                                    <i className="fa fa-envelope text-muted"></i>
                                                </span>
                                            </div>
                                            <input type="email" name="email" placeholder="Email Address" className="form-control bg-white border-left-0 border-md" value={formik.values.email} onChange={formik.handleChange} onBlur={formik.handleBlur} />
                                            {formik.touched.email && formik.errors.email ?
                                                <div className="invalid-feedback" style={{ 'display': 'block' }}>
                                                    {formik.errors.email}
                                                </div>
                                                : null}
                                        </div>
                                        {showOtp === 1 ?
                                            <div>
                                                <div className="input-group col-lg-12 mb-4 text-center">
                                                    <div className="digit-group" data-group-name="digits">
                                                        <div className='row'>
                                                            <div className='col-sm-12 col-xs-12 text-center'>
                                                                <OtpInput
                                                                    inputStyle={{
                                                                        backgroundColor: 'black',
                                                                        color: 'white',
                                                                        width: '3rem',
                                                                        borderRadius: '4px'
                                                                    }}
                                                                    value={otp}
                                                                    isInputNum={true}
                                                                    shouldAutoFocus={true}
                                                                    onChange={handleOtpChange}
                                                                    numInputs={6}
                                                                    separator={<span>-</span>}
                                                                // containerStyle='aaa'
                                                                // inputStyle='form-control'
                                                                />
                                                            </div>
                                                        </div>
                                                        {formik.errors.otp ?
                                                            <div className="invalid-feedback" style={{ 'display': 'block' }}>
                                                                {formik.errors.otp}
                                                            </div>
                                                            : null}
                                                    </div>
                                                </div>
                                                {showRetryOtp === 1 ?
                                                    <div className="form-group col-lg-12 text-right">
                                                        <span className='link' onClick={handleResendOtp}>Send Security Code again</span>
                                                    </div>
                                                    : ""}
                                            </div>
                                            : <p></p>}
                                        {/* <!-- Submit Button --> */}
                                        <div className="form-group col-lg-12 mx-auto mb-0">
                                            <button type="submit" className="btn btn-md btn-block instant_btn hvr-bounce-to-right">
                                                <span className="font-weight-bold"> {loginBtn} </span>
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
                                                Don&rsquo;t have an account?
                                                <Link href={'/auth/register'}>
                                                    <a className="text-primary ml-2 link">Register</a>
                                                </Link>
                                                {/* <span onClick={() => { set_storage('to_scroll', 1); props.history.push('/signup') }} className="text-primary ml-2 link">Register</span> */}
                                            </p>
                                        </div>
                                    </div>
                                </form>
                            }
                        </div>
                    </div>
                </div>
                {/* End of New Login Page */}
                <ToastContainer autoClose={20000}/>
            </section>
        </>
    )
}

export default Login
