import React, { useState, useEffect, Fragment } from 'react'
import Image from 'next/image'
import axios from '../../services/axios'

import { Button, Modal, Form } from 'react-bootstrap';
// import { additional_help } from '../../common/data'
import InputSpinner from 'react-bootstrap-input-spinner'

const Additional = (props) => {
    const [loading, setLoading] = useState(0)

    const { handleHelpStatus, helpStatus, handleHelpStatusValue } = props

    const [show, setShow] = useState(false);

    const handleClose = () => {
        setShow(false)
    }
    // const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    useEffect(() => {
        getAdditionalHelps()
    }, [])

    const [helps, setHelps] = useState([])
    const getAdditionalHelps = async () => {
        setLoading(1)
        const initApi = await axios.get('/service/additional-helps')
        const getData = initApi.data
        if (getData.status == 1) setHelps(getData.data)
        setLoading(0)
    }



    const handleHelpChange = (e, id) => {
        //helpStatus
        // let selectedChkbx = helpStatus.findIndex(a => a.helpId === id)

        props.getAddlHelp(id, e.target.checked)

        // Send to Parent Component
        handleHelpStatus(e, id)
        if (e.target.checked === true && (id === 20 || id === 21)) {
            setShow(true)
        }
    }

    const handleAddlInfoBadge = () => {
        setShow(true)
    }


    const onIncrDecr = (param) => {
        props.onIncrDecr(param)
    }

    return (
        <Fragment>
            <div>
                <p className="left_title"><small>Additional help </small></p>
                <div className="yelloo_box px-3 py-3 mt-5">
                    <p className="question section-heading mb-0">Do you require packing or additional help loading / unloading?</p>
                    <ul className="additional-help-box">
                    {(() => {
                        if (loading == 0 && Object.keys(helps).length > 0) {
                            return (
                                Object.keys(helps).map((key, index) => {
                                    let pickHelpInfo = helpStatus.find(el => el.helpId === helps[key].id);
                                    return (
                                        <li key={index}>
                                            <span className="image-col">
                                                <Image src={helps[key].asset} className="img-fluid" height={50} width={50} layout='fixed' />
                                            </span>
                                            
                                            <span className="service-col">
                                                <div className='mx-2'>{helps[key].name}</div>
                                                {(() => {
                                                    // let pickHelpInfo = helpStatus.find(el => el.helpId === helps[key].id);
                                                    if (pickHelpInfo) {
                                                        return (
                                                            <small className='mx-2 p-1 badge badge-success' onClick={handleAddlInfoBadge}>
                                                                {(() => {
                                                                    if (pickHelpInfo.helpId === 20 && pickHelpInfo.value > 0) {
                                                                        return (
                                                                            <Fragment>
                                                                                Total Porters Required: {pickHelpInfo.value}
                                                                            </Fragment>
                                                                        )
                                                                    } else if (pickHelpInfo.helpId === 21 && pickHelpInfo.value > 0) {
                                                                        return (
                                                                            <Fragment>
                                                                                Total weeks selected: {pickHelpInfo.value}
                                                                            </Fragment>
                                                                        )
                                                                    }
                                                                })()}
                                                            </small>
                                                        )
                                                    }
                                                })()}
                                            </span>
                                            <span className="check_box">
                                                {(() => {
                                                    const defaultChecked = false;
                                                    if (typeof pickHelpInfo !== 'undefined') {
                                                        if (Object.keys(pickHelpInfo).length > 0 && pickHelpInfo.value > 0) {
                                                            defaultChecked = true;
                                                        } else {
                                                            defaultChecked = false;
                                                        }
                                                    } else {
                                                        defaultChecked = false;
                                                    }
                                                    return (
                                                        <input type="checkbox"
                                                            className='addl-option-select spl-checkbox'
                                                            defaultChecked={defaultChecked}
                                                            value={helps[key].id}
                                                            onChange={(e) => handleHelpChange(e, helps[key].id)} />
                                                    )
                                                })()}
                                            </span>
                                        </li>
                                    )
                                })
                            )
                        }
                    })()}
                    </ul>
                </div>
            </div>

            {/*  Modal Box */}
            <Modal
                show={show}
                onHide={handleClose}
                backdrop="static"
                keyboard={false}
            >
                <Modal.Header closeButton={false}>
                    <Modal.Title>Configure Extra Options</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {(() => {
                        if (helpStatus.length > 0) {
                            return (
                                helpStatus.map((h_stat, key) => {
                                    if (h_stat.helpId == 20 && h_stat.status === true) {
                                        // Porters
                                        return (
                                            <Fragment>
                                                <Form.Group className="mb-3" controlId="formBasicEmail" key={key}>
                                                    <Form.Label>How many Porters do you want?</Form.Label>
                                                    <InputSpinner
                                                        type={'int'}
                                                        precision={2}
                                                        max={500}
                                                        min={1}
                                                        step={1}
                                                        value={h_stat.value}
                                                        onChange={num => handleHelpStatusValue(h_stat.helpId, num)}
                                                        variant={'dark'}
                                                        size="lg"
                                                        editable={false}
                                                    />
                                                    {/* <Form.Control type="number" placeholder="Enter Number" value={h_stat.value} onChange={e => handleHelpStatusValue(h_stat.helpId, e.target.value)} /> */}
                                                    <Form.Text className="text-muted">
                                                        Value will be in integer
                                                    </Form.Text>
                                                </Form.Group>
                                            </Fragment>
                                        )
                                    } else if (h_stat.helpId == 21 && h_stat.status === true) {
                                        // Storage
                                        return (
                                            <Fragment>
                                                <Form.Group className="mb-3" controlId="formBasicEmail">
                                                    <Form.Label>How many weeks you want to keep the storage?</Form.Label>
                                                    <InputSpinner
                                                        type={'int'}
                                                        precision={2}
                                                        max={100}
                                                        min={1}
                                                        step={1}
                                                        value={h_stat.value}
                                                        onChange={num => handleHelpStatusValue(h_stat.helpId, num)}
                                                        variant={'dark'}
                                                        size="lg"
                                                        editable={false}
                                                    />
                                                    {/* <Form.Control type="number" placeholder="Enter Number" value={h_stat.value} onChange={e => handleHelpStatusValue(h_stat.helpId, e.target.value)} /> */}
                                                    <Form.Text className="text-muted">
                                                        Amount will be in Weeks
                                                    </Form.Text>
                                                </Form.Group>
                                            </Fragment>
                                        )
                                    }
                                })
                            )
                        }
                    })()}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="warning" onClick={handleClose}>
                        Confirm & Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </Fragment>
    )
}

export default Additional
