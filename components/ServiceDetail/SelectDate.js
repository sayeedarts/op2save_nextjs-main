import React, { useState, useEffect } from 'react'
// import { pickup_options } from '../../common/data'
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import InputErrorDiv from '../Common/InputErrorDiv';
import axios from '../../services/axios';

const SelectDate = (props) => {
    const [loading, setLoading] = useState(0);
    const [pickDate, setPickDate] = useState(new Date());
    const [pickupDateHide, setPickupDateHide] = useState(1);
    const [pickupOptions, setPickupOptions] = useState([]);
    const dateFormat = 'MMMM d, yyyy'
    useEffect(() => {
        getPickupOptions()
    }, [])

    const formik = props.formik
    const handleChangeDate = (date) => {
        setPickDate(date)
        props.onDateChange(date);
        // Formik save date
        formik.values.pickup_date = new Date(date).toISOString().slice(0, 10)
    }

    const getPickupOptions = async () => {
        setLoading(1)
        const initApi = await axios.get('/service/pickup-options')
        const getData = initApi.data;
        if (getData.status == 1) setPickupOptions(getData.data)
        setLoading(0)
    }

    /**
     * On change the pickup type
     * @param {*} event 
     */
    const handlePickupChange = (event) => {
        if (parseInt(event.target.value) == 2) {
            setPickupDateHide(0)
        } else {
            setPickupDateHide(1)
        }
        props.onPickupChange(event.target.value);
    }

    return (
        <div>
            <p className="left_title"><small>Pickup Instructions</small></p>
            <div className="yelloo_box px-3 py-3 mt-5">
                <div className="date_section">
                    {/* <p className="question section-heading mb-4">Pickup Instructions</p> */}
                    <div className="row">
                        <div className="col-lg-6 mb-3">
                            <div className="form-group">
                                <label className="control-label">Select a Timeframe<span className="text-danger">*</span></label>
                                {loading == 0 && Object.keys(pickupOptions).length > 0 ?
                                    <select className="form-control"
                                        id="pickup_urgency"
                                        name="pickup_urgency" value={formik.values.pickup_urgency}
                                        onChange={(e) => handlePickupChange(e)}
                                        onBlur={formik.handleBlur}>
                                        <option value="">-- Select --</option>
                                        {
                                            Object.keys(pickupOptions).map((key, index) => <option value={key} key={index}> {pickupOptions[key]} </option>)
                                        }
                                    </select>
                                    : "Loading.."}
                                <InputErrorDiv formik={formik} elm={'pickup_urgency'} />
                            </div>
                        </div>
                        <div className={'col-lg-6 mb-3 ' + (pickupDateHide == 1 ? 'd-none' : '')}>
                            <label className="control-label">Choose a Potential Date</label>
                            <div className="input-group">
                                <DatePicker 
                                    dateFormat={dateFormat} 
                                    className={"form-control"} 
                                    name="pickup_date"
                                    selected={pickDate}
                                    onChange={(date) => handleChangeDate(date)}
                                />
                                <div>
                                    <input type="text" className="d-none" readOnly={true} value={formik.values.pickup_date} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SelectDate
