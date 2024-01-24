import React, { useEffect, useState } from 'react'
// Next Extn
import Head from 'next/head'
import Link from 'next/link'
import Image from 'next/image'

import { icons, covers } from '../services/data'
import * as Scroll from 'react-scroll';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useFormik } from 'formik';
import axios from '../services/axios'
import { random_str } from '../services/helper'
import InputErrorDiv from '../components/Common/InputErrorDiv';
import TopBanner from '../components/Common/TopBanner';
import ClientCaptcha from "react-client-captcha";
import MetaTags from '../components/Common/MetaTags'


const ContactUs = () => {
    var scroll = Scroll.animateScroll;
    const [errors, setErrors] = useState([]);
    const notify = (status, message) => {
        status == 1 ? toast.success(message) : toast.error(message)
    };
    const [captcha, setCaptcha] = useState("");
    const [captchaText, setCaptchaText] = useState("");
    const [uuid, setUuid] = useState('')
    useEffect(() => {
        // scroll.scrollToTop();
        setUuid(random_str(30))
    }, [])
    const formik = useFormik({
        initialValues: {
            fullname: '',
            email: '',
            contact: '',
            message: '',
            code: ''
        },
        onSubmit: (values, { resetForm }) => {
            // Call Api to Registration
            handleSubmit(values)
            setUuid(random_str(30))
            resetForm();
        },
        validate: values => {
            let errors = {}
            var mobileRegex = /^(?:[+\d].*\d|\d)$/;

            if (Object.keys(formik.errors).length > 0) {
            }
            if (!values.fullname) {
                errors.fullname = "Full name is Required"
            }

            if (!values.code) {
                errors.code = "Enter a valid Captcha"
            }
            if (captcha !== values.code) {
                errors.code = "Invalid Captcha Provided"
            }

            if (!values.email) {
                errors.email = "Email address is Required"
            } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)) {
                errors.email = 'Invalid Email address';
            }
            if (!values.contact || mobileRegex.test(values.contact) === false) {
                errors.contact = "Phone Number is invalid"
            }
            if (!values.message) {
                errors.message = "Message field is Required"
            }
            // if (values.password != values.confirm_pwd) {
            //     errors.confirm_pwd = "Password & Confirm Password not matching"
            // }

            return errors
        }
    })

    const handleSubmit = async (values) => {
        const callApi = await axios.post(`contact-us`, JSON.stringify(values));
        const getResponse = await callApi.data;
        notify(getResponse.status, getResponse.message)
        // setQuoteStatus({ ...getResponse, heading: "Quote Request" })
    }

    return (
        <>
            <Head>
                <title>Contact Us</title>
                <MetaTags title='Contact Us' description='Find all the details on how you can contact our team for man and van services, removals, clearances and more in the London area. Get in touch today.' url={''} image="" />
            </Head>
            <TopBanner title={'Contact Us'} banner='contactus' />
            <section className="contact-us">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-6 col-md-12">
                            <h3>Send us a Message</h3>
                            <form className="mt-4" onSubmit={formik.handleSubmit}>
                                <div className="form-group row">
                                    <label htmlFor="text" className="col-4 col-form-label">Full Name</label>
                                    <div className="col-8">
                                        <div className="input-group">
                                            <input id="text" name="fullname" type="text" className="form-control" value={formik.values.fullname} onChange={formik.handleChange} onBlur={formik.handleBlur} />
                                            <InputErrorDiv formik={formik} elm={'fullname'} />
                                        </div>
                                    </div>
                                </div>
                                <div className="form-group row">
                                    <label htmlFor="text1" className="col-4 col-form-label">Email Address</label>
                                    <div className="col-8">
                                        <input id="email" name="email" type="email" className="form-control" value={formik.values.email} onChange={formik.handleChange} onBlur={formik.handleBlur} />
                                        <InputErrorDiv formik={formik} elm={'email'} />
                                    </div>
                                </div>
                                <div className="form-group row">
                                    <label htmlFor="text2" className="col-4 col-form-label">Phone Number</label>
                                    <div className="col-8">
                                        <input id="text2" name="contact" type="text" className="form-control" value={formik.values.contact} onChange={formik.handleChange} onBlur={formik.handleBlur} maxLength="15" />
                                        <InputErrorDiv formik={formik} elm={'contact'} />
                                    </div>
                                </div>
                                <div className="form-group row">
                                    <label htmlFor="textarea" className="col-4 col-form-label">Message</label>
                                    <div className="col-8">
                                        <textarea id="textarea" value={formik.values.message} name="message" cols="40" rows="5" className="form-control" onChange={formik.handleChange} onBlur={formik.handleBlur} />
                                        <InputErrorDiv formik={formik} elm={'message'} />
                                    </div>
                                </div>
                                <div className="form-group row">
                                    <div className='col-4'></div>
                                    <div className="offset-4 col-8 mt-4">
                                        <div className='row' key={uuid}>
                                            <div className='col-12'>
                                                <ClientCaptcha
                                                    captchaCode={code => setCaptcha(code)}
                                                    backgroundColor="#ffe700"
                                                    width={170}
                                                    charsCount={6} />
                                            </div>
                                            <div className='col-12'>
                                                <input type="text" name='code' placeholder='Enter Captcha' className='form-control my-2' id="user_captcha_input" value={formik.values.code} onChange={formik.handleChange} onBlur={formik.handleBlur} />
                                                <InputErrorDiv formik={formik} elm={'code'} />
                                            </div>
                                        </div>

                                        <button name="submit" type="submit"
                                            className="btn btn-md instant_btn hvr-bounce-to-right my-4">Send Message</button>

                                    </div>
                                </div>
                            </form>
                        </div>
                        <div className="col-lg-6 col-md-12">
                            <Image src={'/assets/contactus-side-ad.jpg'} height={384} width={540} layout='responsive' className="img-fluid mb-3 d-none d-md-block" />
                        </div>
                    </div>
                </div>
                <ToastContainer
                    autoClose={15000}
                    position="bottom-right"
                    theme={'colored'} />
            </section>
        </>
    )
}

export default ContactUs

// // Server Side Fetching
// export async function getStaticProps() {
//     // const siteData = await masterData();
//     return {
//         props: {
//             services: siteData.services,
//             settings: siteData.settings[0]
//         },
//     }
// }
// // Get Master Data
// const masterData = async () => {
//     const callApi = await axios.get('site-settings');
//     const getData = await callApi.data;
//     if (getData.status == 1) {
//         return getData.data
//     }
// }