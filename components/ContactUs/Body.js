import React, { useState } from 'react'
import { useFormik } from 'formik';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from '../../services/axios'
import InputErrorDiv from '../../components/Common/InputErrorDiv';

export const Body = () => {

    const [errors, setErrors] = useState([]);
    const notify = (status, message) => {
        status == 1 ? toast.success(message) : toast.error(message)
    };

    const formik = useFormik({
        initialValues: {
            fullname: '',
            email: '',
            contact: '',
            message: '',
        },
        onSubmit: (values, { resetForm }) => {
            // Call Api to Registration
            handleSubmit(values)
            resetForm();
        },
        validate: values => {
            let errors = {}
            if (Object.keys(formik.errors).length > 0) {
            }
            if (!values.fullname) {
                errors.fullname = "Full name is Required"
            }

            if (!values.email) {
                errors.email = "Email address is Required"
            } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)) {
                errors.email = 'Invalid Email address';
            }

            if (!values.contact) {
                errors.contact = "Contact is Required"
            }
            if (!values.message) {
                errors.message = "Message field is Required"
            }

            return errors
        }
    })

    const handleSubmit = async (values) => {
        const callApi = await axios.post(`contact-us`, JSON.stringify(values));
        const getResponse = await callApi.data;
        notify(getResponse.status, getResponse.message)
    }

    return (
        <>
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
                    <label htmlFor="text2" className="col-4 col-form-label">Contact Number</label>
                    <div className="col-8">
                        <input id="text2" name="contact" type="number" className="form-control" value={formik.values.contact} onChange={formik.handleChange} onBlur={formik.handleBlur} />
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
                    <div className="offset-4 col-8 mt-4"><button name="submit" type="submit"
                        className="btn btn-md instant_btn hvr-bounce-to-right">Send Message</button></div>
                </div>
            </form>
            <ToastContainer autoClose={20000}/>
        </>
    )
}
