import React, { useState, useEffect } from 'react'
import Head from 'next/head'
import axios from '../../../services/axios'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useFormik } from 'formik';
import Breadcrumb from '../../../components/User/Breadcrumb';
import UserBlock from '../../../components/User/UserBlock';

import { countries, user_data, set_storage, cities, token } from '../../../services/helper'
import Header from '../../../components/Layouts/Header';
import Footer from '../../../components/Layouts/Footer';
import InputErrorDiv from '../../../components/Common/InputErrorDiv'

const UserAddress = () => {
    const pageTitle = "User Address"
    // On load
    useEffect(() => {
        // Get Country List
        countries().then((data) => setCountry(data))
        getAddress()
        let CountryDdl = [];
        if (country && country.length > 0) {
            country.map((c, key) => {
                CountryDdl.push({ value: c.id, label: c.name })
            })
            setCountryFld(CountryDdl);
        }
        return () => {
            // cleanup
        }
    }, [])
    // used to toggle the Page Loader
    const [loading, setLoading] = useState(0)
    const [country, setCountry] = useState([])
    // used to fill up the Country dropdown options
    const [countryFld, setCountryFld] = useState([])
    // used to get existing address details from the Database of the current user
    const [address, setAddress] = useState({
        fullname: "",
        email: "",
        mobile: "",
        company: "",
        country: "United Kingdom",
        city: "",
        address: "",
        shipping_fullname: "",
        shipping_email: "",
        shipping_mobile: "",
        shipping_company: "",
        shipping_country: "United Kingdom",
        shipping_city: "",
        shipping_address: ""
    })

    const notify = (status, message) => {
        status == 1 ? toast.success(message) : toast.error(message)
    };

    const formik = useFormik({
        initialValues: address,
        enableReinitialize: true,
        onSubmit: values => {
            updateUserData(values);
        },
        validate: values => {
            let errors = {}
            if (!values.fullname || values.fullname.length > 200) errors.fullname = "Full name is Invalid"
            if (!values.email || values.email.length > 200) errors.email = "Email is Invalid"
            if (!values.mobile || values.mobile.length > 15) errors.mobile = "Mobile number is Invalid"
            if (!values.city || values.city.length > 200) errors.city = "City name is Invalid"
            if (!values.address || values.address.length > 5000) errors.address = "Address is Invalid"
            if (!values.country || values.country.length > 200) errors.country = "Country name is Invalid"
            if (!values.postcode || values.postcode.length > 20) errors.postcode = "Postcode is Invalid"

            if (!values.shipping_fullname || values.shipping_fullname.length > 200) errors.shipping_fullname = "Full name is Invalid"
            if (!values.shipping_email || values.shipping_email.length > 200) errors.shipping_email = "Email is Invalid"
            if (!values.shipping_mobile || values.shipping_mobile.length > 15) errors.shipping_mobile = "Mobile number is Invalid"
            if (!values.shipping_city || values.shipping_city.length > 200) errors.shipping_city = "City name is Invalid"
            if (!values.shipping_address || values.shipping_address.length > 5000) errors.shipping_address = "Address is Invalid"
            if (!values.shipping_country || values.shipping_country.length > 200) errors.shipping_country = "Country name is Invalid"
            if (!values.shipping_postcode || values.shipping_postcode.length > 20) errors.shipping_postcode = "Postcode is Invalid"
            return errors
        }
    })

    const updateUserData = async () => {
        const same_as_billing = checked === true ? 1 : 0
        const userEmail = user_data('email')
        const initApi = await axios.post(`user/address`, { ...formik.values, same_as_billing: same_as_billing, anchor: userEmail })
        const response = await initApi.data
        if (response.status == 1) {
        }
        notify(response.status, response.message)
    }

    const getAddress = async () => {
        setLoading(1)
        const userEmail = user_data('email')
        const initApi = await axios.post(`user/address/get`, { 'email': userEmail })
        const response = await initApi.data
        if (response.status == 1) {
            setAddress({
                fullname: response.data.fullname,
                email: response.data.email,
                mobile: response.data.mobile,
                company: response.data.company,
                country: response.data.country,
                city: response.data.city,
                address: response.data.address,
                postcode: response.data.postcode,
                shipping_fullname: response.data.shipping_fullname,
                shipping_email: response.data.shipping_email,
                shipping_mobile: response.data.shipping_mobile,
                shipping_company: response.data.shipping_company,
                shipping_country: response.data.shipping_country,
                shipping_city: response.data.shipping_city,
                shipping_address: response.data.shipping_address,
                shipping_postcode: response.data.shipping_postcode
            })
            // Set checkbox check or not
            setChecked(response.data.same_as_billing === 1 ? true : false)
        }
        setLoading(0)
    }

    const handleSubmit = async (values) => {
        const request_payload = JSON.stringify(values);
        const anchorCol = user_data('email')
        const initApi = await axios.post('user/address', { data: request_payload, anchor: anchorCol })
        const getResponse = await initApi.data
        if (getResponse.status == 1) {
            set_storage('user', JSON.stringify(values))
        }
        notify(getResponse.status, getResponse.message)
    }

    // Same as Shipping Checkbox
    const [checked, setChecked] = useState(false)
    const handleCheckbox = (event) => {
        setChecked(event.target.checked)

        if (event.target.checked === true) {
            formik.values.shipping_address = formik.values.address
            formik.values.shipping_city = formik.values.city
            formik.values.shipping_company = formik.values.company
            formik.values.shipping_country = formik.values.country
            formik.values.shipping_email = formik.values.email
            formik.values.shipping_fullname = formik.values.fullname
            formik.values.shipping_mobile = formik.values.mobile
            formik.values.shipping_postcode = formik.values.postcode
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
                    <Breadcrumb activeMenu={'user-address'} title={pageTitle} />
                </div>
                <div className='container'>
                    <div className="row gutters-sm animate__animated-X animate__fadeInUp_X">
                        <UserBlock activeMenu={'user-profile'} />
                        <div className="col-md-9">
                            <div className="card mb-3">
                                <div className="card-body">
                                    <h3 className="mb-3">Manage Address</h3>
                                    {loading == 0 ?

                                        <form onSubmit={formik.handleSubmit} autoComplete='OFF'>
                                            <div className="row">
                                                <div className='col-6'>
                                                    {/* Billing Address */}
                                                    <h5>Billing Address</h5>
                                                    <div className="form-group">
                                                        <label htmlFor='exampleInputEmail1'>Full Name</label>
                                                        <input name="fullname" placeholder="Full name" className="form-control" onChange={formik.handleChange} onBlur={formik.handleBlur} value={formik.values.fullname} />
                                                        <InputErrorDiv formik={formik} elm={'fullname'} />
                                                    </div>
                                                    <div className="form-group">
                                                        <label htmlFor='exampleInputEmail1'>Email</label>
                                                        <input name="email" placeholder="Email address" className="form-control" onChange={formik.handleChange} onBlur={formik.handleBlur} value={formik.values.email} />
                                                        <InputErrorDiv formik={formik} elm={'email'} />
                                                    </div>
                                                    <div className="form-group">
                                                        <label htmlFor='exampleInputEmail1'>Mobile</label>
                                                        <input name="mobile" placeholder="Mobile No." className="form-control" onChange={formik.handleChange} onBlur={formik.handleBlur} value={formik.values.mobile} />
                                                        <InputErrorDiv formik={formik} elm={'mobile'} />
                                                    </div>
                                                    <div className="form-group">
                                                        <label htmlFor='exampleInputEmail1'>Country</label>
                                                        <input name="country" placeholder="Country" className="form-control" onChange={formik.handleChange} onBlur={formik.handleBlur} value={formik.values.country} />
                                                        <InputErrorDiv formik={formik} elm={'country'} />
                                                    </div>
                                                    <div className="form-group">
                                                        <label htmlFor='exampleInputEmail1'>City/Locality</label>
                                                        <input name="city" placeholder="City/Locality" className="form-control" onChange={formik.handleChange} onBlur={formik.handleBlur} value={formik.values.city} />
                                                        <InputErrorDiv formik={formik} elm={'city'} />
                                                    </div>
                                                    <div className="form-group">
                                                        <label htmlFor='exampleInputEmail1'>Address</label>
                                                        <input name="address" placeholder="Full Address" className="form-control" value={formik.values.address} onChange={formik.handleChange} onBlur={formik.handleBlur} />
                                                        <InputErrorDiv formik={formik} elm={'address'} />
                                                    </div>
                                                    <div className="form-group">
                                                        <label htmlFor='exampleInputEmail1'>Postcode</label>
                                                        <input name="postcode" placeholder="Postcode" className="form-control" value={formik.values.postcode} onChange={formik.handleChange} onBlur={formik.handleBlur} />
                                                        <InputErrorDiv formik={formik} elm={'postcode'} />
                                                    </div>
                                                </div>
                                                <div className='col-6'>
                                                    {/* Shipping Address */}
                                                    <h5>Shipping Address</h5>
                                                    <div className="form-group ml-4">
                                                        {/* <input type="checkbox" className="form-check-input" id="exampleCheck1" /> */}
                                                        <input type="checkbox" onChange={e => handleCheckbox(e)} value={1} name="same_as_billing" className="form-check-input" checked={checked} />
                                                        <label className="form-check-label" htmlFor='exampleCheck1'>Same as Billing Information</label>

                                                    </div>
                                                    <div className="form-group">
                                                        <label htmlFor='exampleInputEmail1'>Full Name</label>
                                                        <input type="text" name="shipping_fullname" placeholder="Full name" className="form-control" onChange={formik.handleChange} onBlur={formik.handleBlur} value={formik.values.shipping_fullname} />
                                                        <InputErrorDiv formik={formik} elm={'shipping_fullname'} />
                                                    </div>
                                                    <div className="form-group">
                                                        <label htmlFor='exampleInputEmail1'>Email</label>
                                                        <input type="text" name="shipping_email" placeholder="Email address" className="form-control" onChange={formik.handleChange} onBlur={formik.handleBlur} value={formik.values.shipping_email} />
                                                        <InputErrorDiv formik={formik} elm={'shipping_email'} />
                                                    </div>
                                                    <div className="form-group">
                                                        <label htmlFor='exampleInputEmail1'>Mobile</label>
                                                        <input type="text" name="shipping_mobile" placeholder="Mobile No." className="form-control" onChange={formik.handleChange} onBlur={formik.handleBlur} value={formik.values.shipping_mobile} />
                                                        <InputErrorDiv formik={formik} elm={'shipping_mobile'} />
                                                    </div>
                                                    <div className="form-group">
                                                        <label htmlFor='exampleInputEmail1'>Country</label>
                                                        <input type="text" name="shipping_country" placeholder="Country" className="form-control" onChange={formik.handleChange} onBlur={formik.handleBlur} value={formik.values.shipping_country} />
                                                        <InputErrorDiv formik={formik} elm={'shipping_country'} />
                                                    </div>
                                                    <div className="form-group">
                                                        <label htmlFor='exampleInputEmail1'>City/Locality</label>
                                                        <input type="text" name="shipping_city" placeholder="City/Locality" className="form-control" onChange={formik.handleChange} onBlur={formik.handleBlur} value={formik.values.shipping_city} />
                                                        <InputErrorDiv formik={formik} elm={'shipping_city'} />
                                                    </div>
                                                    <div className="form-group">
                                                        <label htmlFor='exampleInputEmail1'>Address</label>
                                                        <input type="text" as="textarea" rows="4" name="shipping_address" placeholder="Full Address" className="form-control" value={formik.values.shipping_address} onChange={formik.handleChange} onBlur={formik.handleBlur} />
                                                        <InputErrorDiv formik={formik} elm={'shipping_address'} />
                                                    </div>
                                                    <div className="form-group">
                                                        <label htmlFor='exampleInputEmail1'>Postcode</label>
                                                        <input name="shipping_postcode" placeholder="Postcode" className="form-control" value={formik.values.shipping_postcode} onChange={formik.handleChange} onBlur={formik.handleBlur} />
                                                        <InputErrorDiv formik={formik} elm={'shipping_postcode'} />
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="row">
                                                <div className="col-sm-12">
                                                    <input type="submit" className="btn btn-primary" value="Update Details" />
                                                </div>
                                            </div>
                                        </form>

                                        : ""}
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

export default UserAddress
