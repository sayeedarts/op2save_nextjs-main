import React, { useState, useEffect, useRef } from 'react'
//Nextjs
import { useRouter } from 'next/router'
import Image from 'next/image'
import { covers } from '../../services/data'
import { locations, postcode_info, uuid, user_uuid, set_storage, debug } from '../../services/helper'
import { useSelector, useDispatch } from 'react-redux'
import { homePageData, selectedService, test } from '../../redux/homeSlice';
// Toaster
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const QueryForm = (props) => {
    const router = useRouter();
    const dispatch = useDispatch();
    const [whatAreYouMovingToggle, setWhatAreYouMovingToggle] = useState(false);
    const [whatAreYouMovingValue, setWhatAreYouMovingValue] = useState({});
    const [serviceText, setServiceText] = useState("");

    // Toster intiialize
    const notify = (status, message) => {
        status == 1 ? toast.success(message) : toast.error(message)
    };

    // From Location 
    const [fromLocationToggle, setFromLocationToggle] = useState('hide');
    const [fromLocations, setFromLocations] = useState('');
    const [fromLocationsValue, setFromLocationsValue] = useState('');

    // To Location 
    const [toLocationToggle, setToLocationToggle] = useState('hide');
    const [toLocations, setToLocations] = useState('');
    const [toLocationsValue, setToLocationsValue] = useState('');

    // const [searchType, SetSearchType] = useState('postcode')
    // const hanldeSearchType = (type) => {
    //     SetSearchType(type)
    // }

    // Reset Form
    const resetSearchForm = () => {
        setFromLocationsValue("")
        setToLocationsValue("")
        setServiceText("")
    }

    const [chevron, setChevron] = useState(false);
    const handleQueryMovingToggle = (status) => {
        setWhatAreYouMovingToggle(!whatAreYouMovingToggle);
        setChevron(!chevron)
    }
    // const value = useSelector((state) => state.homeSlice.value)
    const home_page_data = useSelector((state) => state.homeSlice.services);
    useEffect(() => {
        dispatch(homePageData())
        return () => {
            // console.log("Clean Up");
        }
    }, [dispatch])

    function handleServiceClick(e, service) {
        e.preventDefault()
        handleQueryMovingToggle('hide')
        setServiceText(service.title)
        setWhatAreYouMovingValue(service)
    }

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
        postcode_info(udprn).then(house => setFromLocationsValue(house.full));
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
        postcode_info(udprn).then(house => setToLocationsValue(house.full));
    }


    /**
     * Toggle Placeholder test for Pickup and Dropup Location Box
     */
    const [fieldAttributes, setFieldAttributes] = useState({
        pickupPH: "Pick up Location",
        dropupPH: "Drop up Location",
    })
    const handlePlaceholder = (type, action) => {
        if (type === "drop") {
            if (action === "focus") {
                setFieldAttributes({ ...fieldAttributes, dropupPH: "Type address or postcode" })
            } else {
                setFieldAttributes({ ...fieldAttributes, dropupPH: "Drop up Location" })
            }
        } else if (type === "pick") {
            if (action === "focus") {
                setFieldAttributes({ ...fieldAttributes, pickupPH: "Type address or postcode" })
            } else {
                setFieldAttributes({ ...fieldAttributes, pickupPH: "Pick up Location" })
            }
        }
    }
    // End

    /**
     * Handle Submit when the Query form is Submitted
     */
    const handleSubmit = () => {
        const slug = whatAreYouMovingValue.slug;
        const key = uuid();
        const QueryFormData = {
            user_uuid: user_uuid(),
            service: whatAreYouMovingValue,
            fromLoc: fromLocationsValue,
            toLoc: toLocationsValue,
        };
        // Validations
        if (Object.keys(whatAreYouMovingValue).length == 0 || fromLocationsValue == "" || toLocationsValue == "") {
            notify('error', "Please select required Service and Location(s)")
            return
        }
        set_storage('user_quote_request', JSON.stringify(QueryFormData))
        // Store service details in store
        dispatch(selectedService(QueryFormData))
        router.push(`/request-quote/${slug}`)
    }

    return (
        <>
            <section className="instant_price_section">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-6" >
                            <form action="get-quotes.html">
                                <p className="heading animate__animated animate__bounce">We save you money moving <span>anything, anywhere</span></p>
                                <div className="form-group parent_div">
                                    <div className="row mt-3">
                                        <div className="col-lg-12">
                                            <div className='input-group biginput'>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    id="what_are_you_moving"
                                                    value={serviceText}
                                                    readOnly={true}
                                                    autoComplete="off"
                                                    // onFocus={() => handleQueryMovingToggle()}
                                                    onClick={() => handleQueryMovingToggle()}
                                                    placeholder="What are you moving ?" />
                                                <div className="input-group-prepend biginput_ddl">
                                                    <span className="input-group-text chevron" id="basic-addon1" onClick={() => handleQueryMovingToggle()}>
                                                        <i className={'fa fa-chevron-' + (chevron === true ? 'up' : 'down')}></i>
                                                    </span>
                                                </div>
                                            </div>

                                            <div className={"list_search what_are_you_moving " + (whatAreYouMovingToggle ? "hide" : "d-none")}>
                                                {/* <div className="text-right close">
                                                    <i className='fa fa-times-circle p-2 link' onClick={() => handleQueryMovingToggle()}></i>
                                                </div> */}
                                                <div className="row">
                                                    <div className="col-lg-7">
                                                        <ul>
                                                            {(() => {
                                                                if (props.services != null && props.services.length > 0) {
                                                                    return (
                                                                        (props.services).map((item, i) => {
                                                                            if (item.featured === 'yes' && (item.display_type === 'both' || item.display_type === 'quotation')) {
                                                                                return (
                                                                                    <li key={i} onClick={(e) => handleServiceClick(e, item)}>
                                                                                        <span className="link">
                                                                                            <span>
                                                                                                <img className="icon" src={item.icon} />
                                                                                            </span>
                                                                                            <span> {item.title} </span>
                                                                                            {/* <i className="fa fa-phone"></i> */}
                                                                                        </span>
                                                                                    </li>
                                                                                )
                                                                            }
                                                                        })
                                                                    )
                                                                }
                                                                return null;
                                                            })()}
                                                        </ul>
                                                    </div>
                                                    <div className="col-lg-5 new_feature">
                                                        <p className="features">New Features</p>
                                                        {(() => {
                                                            if (home_page_data.status === 'success') {
                                                                return (
                                                                    home_page_data.data.map((item, j) => {
                                                                        if (item.featured === 'no') {
                                                                            return (
                                                                                <a key={j} className="mb-0 font_grey"> {item.title} </a>
                                                                            )
                                                                        }
                                                                    })
                                                                )
                                                            }
                                                            return null;
                                                        })()}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="row mt-3">
                                        <div className="col-lg-6">
                                            <div className="form-group location_parent">
                                                <input
                                                    type="text"
                                                    className="form-control h_55"
                                                    id="location_list"
                                                    autoComplete="off"
                                                    placeholder={fieldAttributes.pickupPH}
                                                    value={fromLocationsValue}
                                                    onFocus={(e) => handlePlaceholder('pick', 'focus')}
                                                    onBlur={(e) => handlePlaceholder('pick', 'blur')}
                                                    onChange={(e) => handleFromLocationChange(e)}
                                                />
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
                                                                                    <span className='address'>{location.suggestion}</span>
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
                                            </div>
                                        </div>
                                        {/* Drop off Location */}
                                        <div className="col-lg-6">
                                            <input
                                                type="text"
                                                className="form-control h_55"
                                                id="drop_location"
                                                placeholder={fieldAttributes.dropupPH}
                                                autoComplete="off"
                                                value={toLocationsValue}
                                                onFocus={(e) => handlePlaceholder('drop', 'focus')}
                                                onBlur={(e) => handlePlaceholder('drop', 'blur')}
                                                onChange={(e) => handleToLocationChange(e)}
                                            />
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
                                                                                <span className='address'>{location.suggestion}</span>
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
                                        </div>
                                        <div className='col-12'>
                                            <div className='small w-100'>
                                                <i className='fa fa-info-circle'></i>
                                                &nbsp; Start typing your address or postcode
                                            </div>
                                        </div>
                                    </div>
                                    <div className="row mt-3">
                                        <div className="col-lg-12">
                                            <div className="text-center">
                                                <button type="button" className="btn bg-lg reset_btn hvr-bounce-to-right mr-3 mb-3" onClick={resetSearchForm}>
                                                    Reset <i className="fa fa-refresh ml-2"></i>
                                                </button>
                                                <button className="btn bg-lg instant_btn hvr-bounce-to-right mb-3" type="button" onClick={handleSubmit}>
                                                    Request a Quote
                                                    <i className="fa fa-chevron-right ml-2" aria-hidden="true"></i>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </div>
                        <div className="col-lg-6 animate__animated animate__fadeInUp">
                            <div className="d-none d-lg-block d-md-block">
                                <Image src={covers.home_top_van} width={540} height={420} layout='responsive' priority='lazy' placeholder='empty' alt='van Image' />
                            </div>
                        </div>
                    </div>
                </div>
                <ToastContainer autoClose={20000}/>
            </section>
        </>
    )
}

// Server Side Fetching
// export async function getStaticProps() {
//     return {
//         props: {
//             posts: [],
//         },
//     }
// }

export default QueryForm

