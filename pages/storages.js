import React, { useState, useEffect, useRef, Fragment } from 'react'
import ReactDOM from 'react-dom'
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
// Next Extn
import Head from 'next/head'
import Script from 'next/script'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/router'
// Smooth Scroll
import * as Scroll from 'react-scroll';
import Slider from "react-slick";
// Formik
import { useFormik } from 'formik';
import { useSelector } from 'react-redux'
import Header from '../components/Layouts/Header'
import axios from '../services/axios';
import StorageDetail from '../components/Storage/StorageDetail';
import StorageShortInfo from '../components/Storage/StorageShortInfo';

import { encrypt, to_readable_date, user_data, date_diff, check_login, format } from '../services/helper'
import { icons, covers, price_params, paypal } from '../services/data'

import InputErrorDiv from '../components/Common/InputErrorDiv';
import RequestComplete from '../components/Common/RequestComplete';
import Footer from '../components/Layouts/Footer'
import MetaTags from '../components/Common/MetaTags';
import TopBanner from '../components/Common/TopBanner';
import Loading from '../components/Common/Loading'

if (typeof window !== "undefined") {
    if (typeof window.paypal !== "undefined") {
        if (typeof window.paypal.Buttons !== "undefined") {
            const PayPalButton = window.paypal.Buttons.driver("react", { React, ReactDOM });
        }
    }
}

// Slick Slider Nav Buttons
function SamplePrevArrow(props) {
    const { className, style, onClick } = props;
    return (
        <div
            className={className + " prev"}
            onClick={onClick}
        >
            <i className="fa fa-angle-left"></i>
        </div>
    );
}
function SampleNextArrow(props) {
    const { className, style, onClick } = props;
    return (
        <div
            className={className + " next"}
            onClick={onClick}
        >
            <i className="fa fa-angle-right"></i>
        </div>
    );
}

const Storages = ({ storages }) => {
    const router = useRouter()
    // Slick Settings
    const slickSettings = {
        nextArrow: <SampleNextArrow />,
        prevArrow: <SamplePrevArrow />,
        dots: false,
        infinite: true,
        speed: 300,
        slidesToShow: 5,
        slidesToScroll: 1,
        beforeChange: function (currentSlide, nextSlide) {
            let activeStorageTabId = 0;
            // Case-1 : Not navigate from starting point
            if (currentSlide > 0 && nextSlide > 0 && (currentSlide < nextSlide)) {
                activeStorageTabId = storages[nextSlide].id ?? 0
            } else if (nextSlide == 0) {
                // Case: When coming to Starting Point (0)
                activeStorageTabId = storages[0].id ?? 0
            } else {
                // Case- : Start to Forward Right Side >> 
                if (currentSlide == 0 && nextSlide > currentSlide) {
                    activeStorageTabId = storages[nextSlide].id ?? 0
                } else {
                    // Case: When Moving backward <<
                    let prevSlideKey = parseInt(currentSlide - 1);
                    activeStorageTabId = storages[prevSlideKey].id ?? 0
                }
            }
            setActTab(activeStorageTabId)
            chooseStorage(activeStorageTabId)
        },
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                    infinite: true,
                    dots: false
                }
            },
            {
                breakpoint: 600,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                    infinite: true,
                }
            },
            {
                breakpoint: 480,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                    infinite: true,
                }
            }
        ]
    };

    const [storageStatus, setStorageStatus] = useState({
        status: 0,
        heading: "",
        message: "pending",
        redirect: ""
    });
    // const [storages, setStorages] = useState([]);
    const [selectedStorage, setSelectedStorages] = useState({});
    const [loading, setLoading] = useState(0);
    const [step, setStep] = useState('step-1');
    const [payment, setPayment] = useState({
        price: 0,
        duration: 0,
        vat: 0,
        subtotal: 0,
        total: 0,
        currency: price_params.currency.code,
    });
    var scroll = Scroll.animateScroll;
    const messagesEndRef = useRef(null)

    const settings = useSelector((state) => state.homeSlice.settings);
    const [vat, setvat] = useState(0)
    // const [currency, setCurrency] = useState('USD');
    const [user, setUser] = useState({})
    useEffect(async () => {
        // Get User data from API
        // getUserDetails(user_data());
        setvat(parseFloat(settings.vat))
        setUser(user_data())
        // scroll.scrollToTop();
        document.title = "One Place 2 Save: Storage"
        // Call Storage API
        setSelectedStorages(storages[0])
        setActTab(storages[0].id)

        formik.values.start_date = formik.values.end_date = new Date()
        return () => {
        }
    }, [settings, vat])

    const currentDate = new Date();
    const [reinitialize, setReinitialize] = useState(true);
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date(currentDate.setDate(currentDate.getDate() + 1)));
    const handleChangeDate = (date, field) => {
        setReinitialize(false);
        if (field === "start_date") {
            setStartDate(date)
            formik.values.start_date = new Date(date).toISOString().slice(0, 10)
        } else if (field === "end_date") {
            setEndDate(date)
            formik.values.end_date = new Date(date).toISOString().slice(0, 10)
        }
    }

    const formik = useFormik({
        initialValues: {
            name: user.name ?? '',
            email: user.email ?? '',
            mobile: user.mobile ?? '',
            postcode: user.postcode ?? '',
            reason_for_storage: '',
            start_date: startDate,
            end_date: endDate,
        },
        enableReinitialize: reinitialize,
        onSubmit: values => {
            // Call Api to Registration
            // Calculate or set Price
            const duration = date_diff(values.start_date, values.end_date)
            const weeks = Math.ceil(duration / 7);
            let subTotal = weeks * selectedStorage.price
            // calculate vat Amount from %age value
            let vatPrice = format(subTotal * (vat / 100))
            let totalAmount = parseFloat(subTotal) + parseFloat(vatPrice);
            const amountObj = {
                price: selectedStorage.price,
                duration: weeks,
                vat: vatPrice,
                subtotal: subTotal,
                total: totalAmount.toFixed(2),
            }
            setPayment({ ...payment, ...amountObj });
            toggleStep('step-3')

        },
        validate: values => {
            let errors = {}
            var mobileRegex = /^(?:[+\d].*\d|\d)$/;

            if (Object.keys(formik.errors).length > 0) {
            }
            // Check for Required
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
            if (!values.mobile || mobileRegex.test(values.mobile) === false) {
                errors.mobile = "Phone Number is invalid"
            }
            if (!values.postcode) {
                errors.postcode = "Postcode is Required"
            }

            if (!values.reason_for_storage) {
                errors.reason_for_storage = "Reason for Storage Booking is Required"
            }

            let startDate = new Date(values.start_date);
            let endDate = new Date(values.end_date);

            if (startDate >= endDate) {
                errors.start_date = "Invalid Date Range Selection. Please choose a Valid Start and End date."
                errors.end_date = "Invalid Date Range Selection"
            } else {
                if (!values.start_date) {
                    errors.start_date = "Start Date of Storage Booking is Required"
                }
                if (!values.end_date) {
                    errors.end_date = "Storage Booking till date is Required"
                }
            }
            
            return errors
        }
    })

    const [userData, setUserData] = useState({
        name: "Tanmaya",
        email: "tanmaya@gmail.com",
        mobile: "",
        postcode: ""
    });
    const getUserDetails = async (data) => {
        const initApi = await axios.post('user/details', {
            email: data.email
        })
        const getResponse = await initApi.data;
        if (getResponse.status === 1) {
            getResponse.data
            setUserData({
                name: getResponse.data.name ?? null,
                email: getResponse.data.email ?? null,
                mobile: getResponse.data.mobile ?? null,
                postcode: getResponse.data.postcode ?? null
            });
        } else {
            // no relevant user exists
            clear_user_data();
            router.push('/auth/login')
        }
    }

    /**
     * Set Selected Storage on clicking on the Storage
     * @param {id} id Storage ID 
     */
    const [actTab, setActTab] = useState("")
    const chooseStorage = (id) => {
        const storageIndex = storages.findIndex((obj => obj.id == id))
        setActTab(id)
        toggleStep("step-1")
        setSelectedStorages(storages[storageIndex])
    }

    /**
     * 
     * @param {*} storageId 
     */
    const storageBuy = (storageId) => {
    }

    const toggleStep = (step) => {
        setStep(step)
        scroll.scrollTo(200);
        // messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
        // scroll.scrollToBottom({duration: 5000, to: '#tanmaya'})
    }

    /**
     * Paypal Integration Starts
     */
    const createOrder = (data, actions) => {
        const purchaseUnit = [
            {
                description: selectedStorage.name + " for " + payment + " Day(s)",
                amount: {
                    currency_code: payment.currency,
                    value: payment.total,
                },
            },
        ];
        return actions.order.create({
            intent: "CAPTURE",
            purchase_units: purchaseUnit,
        });
    }

    const onApprove = async (data, actions) => {
        const capture = await actions.order.capture();
        // setPurchaseInfo(capture);
        afterPurchase(data);
    }

    function onError(err) {
        // const requestParam = {
        //     gateway_response: purchaseInfo,
        //     user_id: 1,
        // }
    }

    /**
     * What to do After purchase done
     */
    const afterPurchase = async (payload) => {
        setLoading(1)
        const request_payload = encrypt(JSON.stringify({
            paymentResponse: payload,
            paymentDetails: payment,
            storage: selectedStorage.id,
            user: user_data('email'),
            details: formik.values
        }));
        const initApi = await axios.post('/storage/payment', { data: request_payload })
        const getResponse = await initApi.data;
        if (getResponse.status == 1) {
            setStorageStatus({
                status: 1,
                heading: "Your Payment was successful",
                message: "We have received your payment. You can print your invoice from your profile section",
                redirectTo: '/user/profile',
                redirectText: 'Go to Dashboard'
            })
        } else {
            setStorageStatus({
                status: 0,
                heading: "Your Payment was failed",
                message: "Due to some problem we could not process your payment. Please try again later.",
                redirectTo: '/user/profile',
                redirectText: 'Go to Dashboard'
            })
        }

        setLoading(0)
    }
    // End of Paypal Integration
    const handleSlickNav = (direction) => {

    }

    /**
     * Date Opeartions
     */
    const manageDates = (date, operation = 'subtraction', days) => {
        if (operation === 'subtraction')
            date.setDate(date.getDate() - days);
        else
            date.setDate(date.getDate() + days);
        return date;
    }

    return (
        <>
            <Head>
                <link rel="stylesheet" href="css/storage.css" />
                <MetaTags title={'Buy Storages'} description={'Looking for a quality and reliable man and van in London? Our one-stop multi-service company is family run and has been providing great value London removals since 2008'} tags={'Man and Van | London Removals | OnePlace2Save Mutli Service Company'} url={''} image={'/assets/images/seo/home-group-photo.jpg'} />
            </Head>
            {/* Paypal Script */}
            <Script
                src={`https://www.paypal.com/sdk/js?client-id=${paypal.client_id}&currency=${paypal.currency}`}
                strategy='beforeInteractive'
                onLoad={() => {
                    console.log("Paypal Loads");
                }} />

            {/* Top Banner section */}
            {(() => {
                if (storageStatus.status === 0) {
                    return (
                        <TopBanner title={'Buy Storage'} banner='storage' />
                    )
                }
            })()}

            <section className="contact-us">
                <div className="container">
                    {(() => {
                        if (loading === 1) {
                            return (
                                <Loading title={'Processing your Payment, please wait.'} />
                            )
                        } else if (storageStatus.status == 1 && storageStatus.status) {
                            return (
                                <RequestComplete quoteStatus={storageStatus} redirect='/user-profile' formik={formik} />
                            )
                        } else {
                            return (
                                <section className="tab1 container animate__animated animate__slideInUp">
                                    {/* Top Tab Section */}
                                    <div className="text-center mb-4">
                                        <h4 className="title"><strong>Choose your space</strong></h4><br />
                                        <h6>You can pick a storage, fillup all details and purchase. Thats Simple!</h6>
                                    </div>
                                    {/* <!-- Tab panes --> */}
                                    <div className="tab-content">
                                        <div className="tab-pane active" id="tabs-1" role="tabpanel">
                                            <Slider {...slickSettings}>
                                                {(() => {
                                                    if (storages && storages.length > 0) {
                                                        return (
                                                            storages.map((storage, index) => {
                                                                return (
                                                                    <StorageShortInfo data={storage} chooseStorage={chooseStorage} key={index} activeTab={actTab} />
                                                                )
                                                            })
                                                        )
                                                    }
                                                })()}
                                            </Slider>
                                        </div>
                                    </div>

                                    {(() => {
                                        if (step == "step-1") {
                                            if (selectedStorage) {
                                                return (
                                                    <StorageDetail data={selectedStorage} toggleStep={toggleStep} />
                                                )
                                            } else {
                                                return (
                                                    <div>404 No data</div>
                                                )
                                            }
                                        }
                                    })()}
                                    <div ref={messagesEndRef} />
                                    {/* <!-- Form details  --> */}
                                    <section className="main-x animate__animated animate__slideInUp">
                                        <div className="container-fluid">
                                            {step == "step-2" ?
                                                <Fragment>
                                                    {check_login() == 0 ?
                                                        <Fragment>
                                                            <div className="col-12 my-5" >
                                                                <div className="text-danger text-center">
                                                                    <h3 className="mb-4">Please login to continue!</h3>
                                                                    <span className="href my-5" onClick={() => router.push('/auth/login')}>Login here</span>
                                                                </div>
                                                            </div>
                                                        </Fragment> :
                                                        <form id="tanmaya" onSubmit={formik.handleSubmit} autoComplete='OFF'>
                                                            <div className={"row mb-5 mt-3 " + (step == "step-2" ? "" : "d-none")}>
                                                                <div className="col-md-6">
                                                                    <h4 className="subheading"> Your Storage Needs</h4>
                                                                    <div className="storage-x mt-1">

                                                                        <div className="form-group">
                                                                            <label htmlFor="start_date">Flexible start date for storage</label>
                                                                            <DatePicker className={"form-control"} name="start_date"
                                                                                dateFormat={'d/MMMM/yyyy'}
                                                                                selected={startDate}
                                                                                minDate={manageDates(new Date(), 'subtract', 0)}
                                                                                onChange={(date) => handleChangeDate(date, 'start_date')}
                                                                            />
                                                                            {/* <input type="date" id="start_date" name="start_date" placeholder="Flexible start date for storage" className="form-control mb-4" value={formik.values.start_date} onChange={formik.handleChange} onBlur={formik.handleBlur} /> */}
                                                                            <InputErrorDiv formik={formik} elm={'start_date'} />
                                                                        </div>
                                                                        <div className="form-group">
                                                                            <label htmlFor="end_date">Flexible end date for storage</label>
                                                                            <DatePicker className={"form-control"} name="end_date"
                                                                                dateFormat={'d/MMMM/yyyy'}
                                                                                selected={endDate}
                                                                                minDate={manageDates(new Date(), 'add', 1)}
                                                                                onChange={(date) => handleChangeDate(date, 'end_date')}
                                                                            />
                                                                            {/* <input id="end_date" type="date" name="end_date" placeholder="Start Date" className="form-control bg-white border-left-0 border-md" value={formik.values.end_date} onChange={formik.handleChange} onBlur={formik.handleBlur} /> */}
                                                                            <InputErrorDiv formik={formik} elm={'end_date'} />
                                                                        </div>
                                                                        <div className="form-group">
                                                                            <label htmlFor="start_date"> Reason for Storage Booking </label>
                                                                            <select id="reason_for_storage" name="reason_for_storage" className="form-control mb-4" value={formik.values.reason_for_storage} onChange={formik.handleChange} onBlur={formik.handleBlur}>
                                                                                <option value="">-- Select Option --</option>
                                                                                <option value="2">Moving</option>
                                                                                <option value="3">Decluttering</option>
                                                                                <option value="4">Home Improvements</option>
                                                                                <option value="5">Change in personal circumstances</option>
                                                                                <option value="6">Travelling</option>
                                                                                <option value="7">Others</option>
                                                                            </select>
                                                                            <InputErrorDiv formik={formik} elm={'reason_for_storage'} />
                                                                        </div>
                                                                    </div>
                                                                </div>

                                                                <div className="col-md-6">
                                                                    <h4 className="subheading"> Just a few more details</h4>
                                                                    <div className="storage-x mt-1">
                                                                        <div className="form-group">
                                                                            <label htmlFor="start_date">First Name</label>
                                                                            <input type="text" name="name" placeholder="First Name" className="form-control" value={formik.values.name} onChange={formik.handleChange} onBlur={formik.handleBlur} />
                                                                            <InputErrorDiv formik={formik} elm={'name'} />
                                                                        </div>
                                                                        <div className="form-group">
                                                                            <label htmlFor="start_date">Email</label>
                                                                            <input type="email" name="email" placeholder="Email" className="form-control" value={formik.values.email} onChange={formik.handleChange} onBlur={formik.handleBlur} />
                                                                            <InputErrorDiv formik={formik} elm={'email'} />
                                                                        </div>
                                                                        <div className="form-group">
                                                                            <label htmlFor="start_date">Phone Number</label>
                                                                            <input type="text" name="mobile" placeholder="eg. +44123456789" className="form-control mb-4 pr-2" value={formik.values.mobile} onChange={formik.handleChange} onBlur={formik.handleBlur} />
                                                                            <InputErrorDiv formik={formik} elm={'mobile'} />
                                                                        </div>
                                                                        <div className="form-group">
                                                                            <label htmlFor="start_date">Postcode</label>
                                                                            <input type="text" name="postcode" placeholder="Postcode" className="form-control mb-4 pr-2" value={formik.values.postcode} onChange={formik.handleChange} onBlur={formik.handleBlur} />
                                                                            <InputErrorDiv formik={formik} elm={'postcode'} />
                                                                        </div>
                                                                        <button className="btn btn-md instant_btn hvr-bounce-to-right" type="submit">
                                                                            <i className="fa fa-arrow-right"></i>  Proceed to Payment
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </form>
                                                    }
                                                </Fragment>
                                                : ""}
                                            <div className={"row pb-4 mt-4 " + (step == "step-3" ? "" : "d-none")}>
                                                <div className="col-md-6"></div>
                                                {Object.keys(selectedStorage).length > 0 && payment.total > 0 ?
                                                    <div className="col-md-6">
                                                        <div className="checkout pt-2 pl-3">
                                                            <h4>Storage Summary
                                                                <button className='btn btn-sm btn-danger pull-right' onClick={() => toggleStep("step-1")}>
                                                                    <i className='fa fa-repeat'></i> Start Over
                                                                </button>
                                                            </h4>
                                                            <hr />
                                                            <div className="row">
                                                                <div className="col-md-3">
                                                                    <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTH-kA9QxtWs9Ejnd0LEtTYA_o0PdAzSKWqzA&usqp=CAU"
                                                                        height="60" width="60" alt='default home' />
                                                                </div>
                                                                <div className="col-md-8">
                                                                    <span>
                                                                        <b> Unit Price: {price_params.currency.symbol}{payment.price}</b> <br />
                                                                        <b> Duration: {payment.duration} Week(s)</b><br />
                                                                        {/* <b> {price_params.currency.symbol}{payment.total}</b><br /> */}
                                                                        <p> {selectedStorage.name} </p>
                                                                        <b>QTY 1</b>
                                                                    </span>
                                                                </div>
                                                            </div>
                                                            <hr />
                                                            <div>
                                                                <p>Net
                                                                    <span className="check2">
                                                                        {price_params.currency.symbol}{format(payment.subtotal)}
                                                                    </span>
                                                                </p>
                                                                <p>
                                                                    VAT
                                                                    <span className="check2">
                                                                        {price_params.currency.symbol}{payment.vat}
                                                                    </span>
                                                                </p>
                                                                <h6>
                                                                    <b>
                                                                        Total
                                                                        <span className="check2">
                                                                            {price_params.currency.symbol}{payment.total}
                                                                        </span>
                                                                    </b>
                                                                </h6>
                                                            </div>
                                                        </div>

                                                        <div className="row">
                                                            <div className="col-12 mt-3">
                                                                {/* PAYPAL BUTTONS  */}
                                                                {/* <PayPalButton
                                                            createOrder={(data, actions) => createOrder(data, actions)}
                                                            onApprove={(data, actions) => onApprove(data, actions)}
                                                            onCancel={() => onError("Canceled")}
                                                            onError={(err) => onError(err)}
                                                        /> */}

                                                                {(() => {
                                                                    if (typeof window !== "undefined") {
                                                                        if (typeof window.paypal !== "undefined") {
                                                                            if (typeof window.paypal.Buttons !== "undefined") {
                                                                                const PayPalButton = window.paypal.Buttons.driver("react", { React, ReactDOM });
                                                                                return (
                                                                                    <PayPalButton
                                                                                        createOrder={(data, actions) => createOrder(data, actions)}
                                                                                        onApprove={(data, actions) => onApprove(data, actions)}
                                                                                        onCancel={() => onError("Canceled")}
                                                                                        onError={(err) => onError(err)}
                                                                                    />
                                                                                )
                                                                            }
                                                                        }
                                                                    }
                                                                })()}
                                                            </div>
                                                            <div className='col-12 mt-3'>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    :
                                                    <div className="col-md-6"></div>}
                                            </div>
                                        </div>
                                    </section>
                                    {/* <!-- checkout se start --> */}
                                </section>
                            )
                        }
                    })()}

                    {/* Advertisement */}
                    <div className='row mt-5'>
                        <div className='col-12'>
                            <Link href={'/packing-material'}>
                                <a>
                                    <img src={covers.ad_packing_material} className="img-fluid" style={{ 'z-index': '-1' }} alt='Packing Material Advertisement' />
                                    {/* <Image src={covers.ad_packing_material} height={'245px'} width={'1440px'} layout='responsive'/> */}
                                </a>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}

export default Storages

// Server Side Fetching
export async function getStaticProps() {
    const storages = await getStorageData();
    // const siteData = await masterData();
    // const services = await serviceData();
    return {
        props: {
            storages
        },
        revalidate: 10
    }
}

const getStorageData = async () => {
    const initApi = await axios.get('storages');
    const getData = await initApi.data.data;
    return getData
}

// const masterData = async () => {
//     const initApi = await axios.get('/home/masters')
//     const getData = await initApi.data
//     if (getData.status == 1) {
//         return getData.data
//     }
// }

// const serviceData = async () => {
//     const callApi = await axios.get('service/all');
//     const services = await callApi.data.data;
//     if (services.length > 0) {
//         return services
//     }
// }