import React, { useState, useEffect, Fragment } from 'react'
//Nextjs
import { useRouter } from 'next/router'
import Head from 'next/head'
import Image from 'next/image';
;

// Plugins
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useFormik } from 'formik';
import * as Scroll from 'react-scroll';
import { useSelector, useDispatch } from 'react-redux'
// import './ServiceDetail.css'
import {
    getServiceDetails,
    getAdditionaHelps,
    getPickupDetails,
    specialInstructions,
    userDetails,
    emptyQuoteReq
} from '../../redux/homeSlice';
import Category from '../../components/ServiceDetail/Category';
import Additional from '../../components/ServiceDetail/Additional';
import SelectDate from '../../components/ServiceDetail/SelectDate';
import RequestComplete from '../../components/Common/RequestComplete';
import InputErrorDiv from '../../components/Common/InputErrorDiv';
import axios from '../../services/axios'
import { locations, postcode_info, user_data, to_readable_date } from '../../services/helper'
import { icons, price_params, floors } from '../../services/data'
import Loading from '../../components/Common/Loading';

const ServiceDetail = () => {
    const router = useRouter();
    const { slug } = router.query
    var scroll = Scroll.animateScroll;
    // Get ID from URL
    // const params = useParams();
    // Loader
    const [loading, setLoading] = useState(0)

    const [errorCount, setErrorCount] = useState(0)

    // Redux State Values
    const stateData = useSelector((state) => state.homeSlice)
    const service_details = stateData.service_details
    const selectedSlug = stateData.selected_slug
    const [quoteStatus, setQuoteStatus] = useState({
        status: 0,
        heading: "",
        message: 'pending'
    });
    const notify = (status, message) => {
        status == 1 ? toast.success(message) : toast.error(message)
    };
    const user = user_data();
    const dispatch = useDispatch();

    // Use Effect API call
    useEffect(() => {
        // scrollTop()
        dispatch(getServiceDetails(slug))

        // Set From and To Location fields auto selected
        setFromLocationsValue(stateData.query_form.from)
        setToLocationsValue(stateData.query_form.to)

        setErrorCount(Object.keys(formik.errors).length)

        return () => {
            console.log("Clean Up");
            dispatch(emptyQuoteReq())
        }
    }, [dispatch, quoteStatus, selectedSlug])


    // Check and Validate Floors, Lifts, Additional Info details
    const getAdditionalData = () => {
        let data = {}
        if (Object.keys(selectedFloor).length > 0) {
            if (selectedFloor.from_floor && selectedFloor.to_floor) {
                data.floor_details = selectedFloor
            } else {
                notify(0, "Please provide Floor and Lift details")
            }
        } else {
            notify(0, "Please provide Floor and Lift details")
        }
        if (helpStatus.length > 0) {
            data.help_details = helpStatus
        }
        return data;
    }

    // Formik Integration
    const formik = useFormik({
        initialValues: {
            name: user.name,
            email: user.email,
            mobile: user.mobile,
            moving_from: stateData.query_form.from,
            moving_to: stateData.query_form.to,
            special_textarea: '',
            pickup_urgency: '',
            pickup_date: to_readable_date(new Date()),
            category_addl_items: "",
            category: [],
            category_id: [],
            service_items: {}
        },
        onSubmit: async (values) => {
            console.log(values)
            scroll.scrollTo(30);
            if (stateData.selected_items.length > 0) {
                setLoading(1)
                const get_additional_data = getAdditionalData();

                const request_payload = {
                    // user: stateData.user,
                    user: (typeof user.email != "undefined") ? user.email : "",
                    userData: {
                        name: values.name,
                        email: values.email,
                        mobile: values.mobile
                    },
                    selected_service_id: stateData.selected_service_id,
                    from_location: values.moving_from,
                    to_location: values.moving_to,
                    selected_items: stateData.selected_items,
                    category_addl_items: values.category_addl_items,
                    additional_info: get_additional_data,
                    pickup_data: {
                        pickup_date: values.pickup_date,
                        pickup_type: values.pickup_urgency,
                    },
                    additional: stateData.additional,
                    porters: porters,
                    instruction: values.special_textarea,
                }

                const callApi = await axios.post(`quote-request`, JSON.stringify(request_payload));
                const getResponse = await callApi.data;
                if (getResponse.status == 1) {
                    quoteConfirm(getResponse.quote_number)
                }
                notify(getResponse.status, getResponse.message)
                setQuoteStatus({ ...getResponse, heading: "Quote Request" })
            } else {
                setLoading(0)
                notify(0, "Please choose some items for port")
            }
        },
        onChange: values => {
        },
        validate: values => {
            let errors = {}
            var mobileRegex = /^(?:[+\d].*\d|\d)$/;
            if (!values.email) {
                errors.email = "Email address is Required"
            } else if (
                !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)
            ) {
                errors.email = 'Invalid Email address';
            }
            if (!values.mobile || mobileRegex.test(values.mobile) === false) {
                errors.mobile = "Provide a valid mobile no."
            }
            if (!values.name) {
                errors.name = "Full name is Required"
            }
            if (!values.pickup_urgency) {
                errors.pickup_urgency = "Timeframe is Required"
            }
            if (!values.moving_from) {
                errors.moving_from = "Source Location is Required"
            }
            if (!values.moving_to) {
                errors.moving_to = "Destination Location is Required"
            }
            return errors
        }
    })

    const quoteConfirm = (quoteHash) => {
        setLoading(0)
        router.push(`/user/quote-confirmation/${quoteHash}`)
    }

    const [helpStatus, setHelpStatus] = useState([])
    const handleHelpStatus = (e, id) => {
        const found = helpStatus.some(el => el.helpId === id);
        if (!found) {
            setHelpStatus([...helpStatus, { helpId: id, status: e.target.checked, value: 0 }])
        } else {
            helpStatus.splice(helpStatus.findIndex(a => a.helpId === id), 1)
            setHelpStatus([...helpStatus, { helpId: id, status: e.target.checked, value: 0 }])
        }
    }

    // Additional Help
    // const [helps, setHelps] = useState([])
    const handleAdditionalHelp = (id, status) => {
        dispatch(getAdditionaHelps({ id: id, status: status }))
    }

    // Pickup Types
    // const [pickupType, setPickupType] = useState();
    const onDateChange = (p) => {
        const getDate = new Date(p).toISOString().slice(0, 10);
        dispatch(getPickupDetails({ pickup_date: getDate }))
    }
    const onPickupChange = (id) => {
        formik.values.pickup_urgency = id
        dispatch(getPickupDetails({ pickup_type: id }))
    }

    // Extra details on Additional Information
    const [extraInfo, setExtraInfo] = useState()



    /**
     * Onchanging the Values inside the Modal
     * @param {*} id  ID of the additional help
     * @param {*} value Value will be in number
     */
    const handleHelpStatusValue = (id, value) => {
        const getValue = parseInt(value)

        // Dont allow value below than 1
        // if (getValue >= 1) {
        const objIndex = helpStatus.findIndex((obj => obj.helpId === id));
        helpStatus[objIndex].status = true;
        helpStatus[objIndex].value = getValue;
        setHelpStatus(JSON.parse(JSON.stringify(helpStatus)));
        // }
    }


    // Control Porter's Count
    const [porters, setPorters] = useState(2)
    const onIncrDecr = (param) => {
        if (param == 'incr') setPorters(porters + 1)
        else if (param == 'decr' && porters > 1) setPorters(porters - 1)
    }

    /**
     * manage Flooring and Lift Options
     */
    const [selectedFloor, setSelectedFloor] = useState({ from_floor: 'basement', from_lift: 0, to_floor: 'basement', to_lift: 0 })

    const handleFloorChange = (type, where, e) => {
        if (type === 'floor') {
            if (where === 'from') {
                setSelectedFloor({ ...selectedFloor, from_floor: e.target.value })
            } else {
                setSelectedFloor({ ...selectedFloor, to_floor: e.target.value })
            }
        } else if (type === 'lift') {
            const isChecked = e.target.checked ? 1 : 0
            if (where === 'from') {
                setSelectedFloor({ ...selectedFloor, from_lift: isChecked })
            } else {
                setSelectedFloor({ ...selectedFloor, to_lift: isChecked })
            }
        }
    }


    /**
     * Operate From and To Locations -------------------------------------------
     */
    const keyPress = (event, option) => {
    }

    // From Location 
    const [fromLocationToggle, setFromLocationToggle] = useState('hide');
    const [fromLocations, setFromLocations] = useState('');
    const [fromLocationsValue, setFromLocationsValue] = useState('');

    // To Location 
    const [toLocationToggle, setToLocationToggle] = useState('hide');
    const [toLocations, setToLocations] = useState('');
    const [toLocationsValue, setToLocationsValue] = useState('');


    /**
     * Get Search Keyword and send to Location API to get matching Locations
     * @param {object} e event
     */
    const handleFromLocationChange = (e) => {
        e.preventDefault();
        if (e.target.value == "" || e.target.value == null) {
            setFromLocationsValue(''); setFromLocationToggle('hide'); return false;
        }
        setFromLocationsValue(e.target.value);
        setFromLocationToggle("show");
        const getLocations = locations(e.target.value);
        getLocations.then(response => response.json())
            .then(result => setFromLocations(result.result.hits))
            .catch(error => console.log('error', error));
    }

    // Pickup Location
    const handleFromLocationClick = ({ udprn }) => {
        setFromLocationToggle("hide");
        postcode_info(udprn).then(house => {
            formik.values.moving_from = house.full
            setFromLocationsValue(house.full)
        });
    }

    /**
     * Get Search Keyword and send to Location API to get matching Locations
     * @param {object} e event
     */
    const handleToLocationChange = (e) => {
        e.preventDefault();
        if (e.target.value == "" || e.target.value == null) {
            setToLocationsValue(''); setToLocationToggle('hide'); return false;
        }
        setToLocationsValue(e.target.value);
        setToLocationToggle("show");
        const getLocations = locations(e.target.value);
        getLocations.then(response => response.json())
            .then(result => setToLocations(result.result.hits))
            .catch(error => console.log('error', error));

    }

    // Dropoff Location
    const handleToLocationClick = ({ udprn }) => {
        setToLocationToggle("hide");
        postcode_info(udprn).then(house => {
            formik.values.moving_to = house.full
            setToLocationsValue(house.full)
        });
    }

    const handleSubmit = () => {
        const isInvalid = Object.keys(formik.errors).length
        if (isInvalid > 0) {
            notify(0, "Please provide all valid informations to proceed")
        }
    };

    return (
        <>
            <Head>
                <title> Create Quote Request </title>
                <link rel="stylesheet" href="/css/quote-request.css" />
            </Head>
            <section className="removal_quotes">
                <div className="container">
                    {loading == 1 ?
                        <Loading title={'Please wait, Request is processing'} /> :
                        <Fragment>
                            <form onSubmit={formik.handleSubmit}>
                                <div className="row">
                                    <div className='col-12'>
                                        {(() => {
                                            if (Object.keys(formik.errors).length > 0) {
                                                return (
                                                    <div className='alert alert-danger my-3'>Please provide all required information</div>
                                                )
                                            }
                                        })()}
                                    </div>
                                    <div className="col-lg-8 col-lg-8 col-sm-12">
                                        <p className="left_title"> Get {service_details.data.title} Quotes</p>
                                        {(() => {
                                            if (service_details.status == "success") {
                                                if (service_details.data.category && service_details.data.category.length > 0) {
                                                    return (
                                                        <Fragment>
                                                            <div className="row mt-5 mb-2">
                                                                <div className="col-lg-6 col-md-12 col-sm-12 my-2">
                                                                    <div className="form-group">
                                                                        <label className="control-label label_style">Moving From <span
                                                                            className="text-danger">*</span></label>
                                                                        <input type="text" className="form-control" name="moving_from"
                                                                            placeholder="Start typing to get location.."
                                                                            value={fromLocationsValue}
                                                                            onChange={(e) => handleFromLocationChange(e)}
                                                                            autoComplete="off"
                                                                        />
                                                                        {fromLocations && fromLocations.length > 0 ?
                                                                            <div className={"list_search location_list " + (fromLocationToggle == "hide" ? "d-none" : "")}>
                                                                                <ul>
                                                                                    {(() => {
                                                                                        if ((fromLocations) && fromLocations.length > 0) {
                                                                                            return (
                                                                                                fromLocations.map((location, j) => {
                                                                                                    return (
                                                                                                        <li key={j}>
                                                                                                            <span className="link" onClick={() => handleFromLocationClick(location)}>
                                                                                                                <i className="fa fa-map-marker"></i>
                                                                                                                <span>{location.suggestion}</span>
                                                                                                            </span>
                                                                                                        </li>
                                                                                                    )
                                                                                                })
                                                                                            )
                                                                                        }
                                                                                        return null;
                                                                                    })()}
                                                                                </ul>
                                                                            </div>
                                                                            : ''}
                                                                        <InputErrorDiv formik={formik} elm={'moving_from'} />
                                                                    </div>

                                                                    <div className="form-group">
                                                                        <select className="form-control select-design" onChange={(e) => handleFloorChange('floor', 'from', e)}>
                                                                            {(() => {
                                                                                if (Object.keys(floors).length > 0) {
                                                                                    return (
                                                                                        Object.keys(floors).map((floor, key) => {
                                                                                            const floorKey = Object.keys(floors)[key]
                                                                                            const flootValue = Object.values(floors)[key]
                                                                                            return (
                                                                                                <option value={floorKey} key={key}> {flootValue} </option>
                                                                                            )
                                                                                        })
                                                                                    )
                                                                                }
                                                                            })()}
                                                                        </select>
                                                                    </div>
                                                                    {(() => {
                                                                        if (selectedFloor.from_floor !== 'basement' && selectedFloor.from_floor !== 'ground-floor' && selectedFloor.from_floor !== '') {
                                                                            return (
                                                                                <div className="form-check round-chx">
                                                                                    <input type="checkbox" className="" id="lift-avail-from" onChange={e => handleFloorChange('lift', 'from', e)} />
                                                                                    <label className="" htmlFor="lift-avail-from"></label>
                                                                                    <span>Lift Available</span>
                                                                                </div>
                                                                            )
                                                                        }
                                                                    })()}
                                                                </div>
                                                                <div className="col-lg-6 col-md-12 col-sm-12 my-2">
                                                                    <div className="form-group">
                                                                        <label className="control-label label_style">Moving To <span
                                                                            className="text-danger">*</span></label>
                                                                        <input type="text" className="form-control" name="moving_to"
                                                                            placeholder="Start typing to get location.."
                                                                            autoComplete="off"
                                                                            value={toLocationsValue}
                                                                            onChange={(e) => handleToLocationChange(e)}
                                                                        />
                                                                        {toLocations && toLocations.length > 0 ?
                                                                            <div className={"list_search location_list " + (toLocationToggle == "hide" ? "d-none" : "")}>
                                                                                <ul>
                                                                                    {(() => {
                                                                                        if (toLocations.length > 0) {
                                                                                            return (
                                                                                                toLocations.map((location, k) => {
                                                                                                    return (
                                                                                                        <li key={k}>
                                                                                                            <span className="link" onClick={() => handleToLocationClick(location)}>
                                                                                                                <i className="fa fa-map-marker"></i>
                                                                                                                <span>{location.suggestion}</span>
                                                                                                            </span>
                                                                                                        </li>
                                                                                                    )
                                                                                                })
                                                                                            )
                                                                                        }
                                                                                        return null;
                                                                                    })()}
                                                                                </ul>
                                                                            </div>
                                                                            : ''}
                                                                        <InputErrorDiv formik={formik} elm={'moving_to'} />
                                                                    </div>

                                                                    <div className="form-group">
                                                                        <select className="form-control select-design" onChange={(e) => handleFloorChange('floor', 'to', e)}>
                                                                            {(() => {
                                                                                if (Object.keys(floors).length > 0) {
                                                                                    return (
                                                                                        Object.keys(floors).map((floor, key) => {
                                                                                            const floorKey = Object.keys(floors)[key]
                                                                                            const flootValue = Object.values(floors)[key]
                                                                                            return (
                                                                                                <option value={floorKey} key={key}> {flootValue} </option>
                                                                                            )
                                                                                        })
                                                                                    )
                                                                                }
                                                                            })()}
                                                                        </select>
                                                                    </div>
                                                                    {(() => {
                                                                        if (selectedFloor.to_floor !== 'basement' && selectedFloor.to_floor !== 'ground-floor' && selectedFloor.to_floor !== '') {
                                                                            return (
                                                                                <div className="form-check round-chx">
                                                                                    <input type="checkbox" className="" id="lift-avail-to" onChange={e => handleFloorChange('lift', 'to', e)} />
                                                                                    <label className="" htmlFor="lift-avail-to"></label>
                                                                                    <span>Lift Available</span>
                                                                                </div>
                                                                            )
                                                                        }
                                                                    })()}

                                                                </div>
                                                            </div>

                                                            {/* Category Selection Section */}
                                                            {(() => {
                                                                if (service_details.data.display_type === 'both' || service_details.data.display_type === 'quotation') {
                                                                    return (
                                                                        <Category serviceDetails={service_details.data} slug={slug} formik={formik} />
                                                                    )
                                                                }
                                                            })()}

                                                            <Additional getAddlHelp={handleAdditionalHelp} onIncrDecr={onIncrDecr} porters={porters} extraInfo={extraInfo} helpStatus={helpStatus} handleHelpStatus={handleHelpStatus} handleHelpStatusValue={handleHelpStatusValue} notify={notify} />

                                                            <SelectDate onDateChange={onDateChange} onPickupChange={onPickupChange} formik={formik} />

                                                            <p className="left_title"><small>Special Instructions</small></p>
                                                            <div className="yelloo_box px-3 py-3 mt-5">
                                                                <div className="special_instruction">
                                                                    {/* <p className="question section-heading mb-4">Special Instruction</p> */}
                                                                    <div className="header-section">
                                                                        <button className="btn add_btn d-none">
                                                                            <i className="fa fa-plus"></i> ADD
                                                                        </button>
                                                                    </div>
                                                                    <div className="instruction_box">
                                                                        <textarea
                                                                            className="form-control special_textarea-x" rows="3" name="special_textarea"
                                                                            id="special_textarea"
                                                                            // onChange={handleInstruction}
                                                                            placeholder="Enter Any Special Instructions Here"
                                                                            value={formik.values.special_textarea}
                                                                            onChange={formik.handleChange}
                                                                            onBlur={formik.handleBlur}
                                                                        ></textarea>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            {/* <div className='text-danger'>Please fix above error(s) to proceed</div> */}
                                                        </Fragment>
                                                    )
                                                } else {
                                                    return (
                                                        <div className="row d-flex justify-content-center">
                                                            <div className="col-lg-6 col-md-6 col-sm-6 text-center">
                                                                <h4 className="mt-5 mb-4">No Items present in this category.</h4>
                                                                <Image src={icons.man_with_packages} height={204} width={256} layout='responsive' />
                                                            </div>
                                                        </div>
                                                    )
                                                }
                                            }
                                        })()}
                                    </div>
                                    <div className="col-lg-4 col-md-8 col-sm-12">
                                        {(() => {
                                            if (service_details.status == "success") {
                                                if (service_details.data.category && service_details.data.category.length > 0) {
                                                    return (
                                                        <Fragment>
                                                            <p className="left_title">Customer Details</p>
                                                            <div className="my-4">
                                                                <div className="location">
                                                                    <p className="mt-4">Please provide your details to get Quote detail</p>
                                                                    <div className="form-group">
                                                                        <label className="control-label label_style">Full Name <span className="text-danger">*</span></label>
                                                                        <input type="text" className="form-control" name="name" placeholder="eg. John Doe" value={formik.values.name} onChange={formik.handleChange} onBlur={formik.handleBlur} />
                                                                        <InputErrorDiv formik={formik} elm={'name'} />
                                                                    </div>
                                                                    <div className="form-group">
                                                                        <label className="control-label label_style">Email <span className="text-danger">*</span></label>
                                                                        <input type="email" className="form-control" name="email" placeholder="eg. john@example.com" value={formik.values.email} onChange={formik.handleChange} onBlur={formik.handleBlur} />
                                                                        <InputErrorDiv formik={formik} elm={'email'} />
                                                                    </div>
                                                                    <div className="form-group">
                                                                        <label className="control-label label_style">Mobile Number <span className="text-danger">*</span></label>
                                                                        <input type="text" maxLength={15} className="form-control" name="mobile" placeholder="eg. +44123456789" value={formik.values.mobile} onChange={formik.handleChange} onBlur={formik.handleBlur} />
                                                                        <small className='badge badge-info'>Only integer and + sign allowed</small>
                                                                        <InputErrorDiv formik={formik} elm={'mobile'} />
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </Fragment>
                                                    )
                                                }
                                            }
                                        })()}
                                    </div>
                                </div>
                                {(() => {
                                    if (service_details.status == "success") {
                                        if (service_details.data.category && service_details.data.category.length > 0) {
                                            return (
                                                <div>
                                                    <div className='col-lg-8 col-lg-8 col-sm-12'>
                                                        <div className="text-right mt-4">
                                                            <button className="btn btn-lg instant_btn hvr-bounce-to-right" type="submit" onClick={handleSubmit}>
                                                                Request a Quote
                                                            </button>
                                                        </div>
                                                    </div>
                                                    <div className='col-lg-4 col-md-8 col-sm-12'></div>
                                                </div>
                                            )
                                        }
                                    }
                                })()}

                            </form>
                        </Fragment>
                    }
                </div>
            </section>
            <ToastContainer
                position="bottom-right"
                theme={'colored'}
            />
        </>
    )
}

export default ServiceDetail
