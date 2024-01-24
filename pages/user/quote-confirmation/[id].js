import React, { useState, useEffect, Fragment } from 'react'
// Next
import Head from 'next/head'
import { useRouter } from 'next/router'

import axios from '../../../services/axios';
// import styles from './QuoteConfirm.module.css'
import { icons, api_baseurl } from '../../../services/data'

const QuoteConfirmation = () => {
    const router = useRouter()
    const { id, mode } = router.query

    const [loading, setLoading] = useState(1);
    // const [quoteId, setQuoteId] = useState(params.id);
    const [details, setDetails] = useState({ name: "good" });

    useEffect(() => {
        if (!router.isReady) return;
        setLoading(0)
        getQuoteDetails()
    }, [])

    const getQuoteDetails = async () => {
        setLoading(1)
        const initApi = await axios.get(`quote-request/${id}/details`)
        const getData = await initApi.data
        if (getData.status == 1) {
            setDetails(getData.data)
        }
        setLoading(0)
    }

    return (
        <>
            <Head>
                <title> User: Quote Requests </title>
                <link rel="stylesheet" href="/css/quote-confirmation.css" />
            </Head>
            <section className='summary_details'>
                <div className="container">
                    <p className="title title-lg ">
                        {mode == "details" ? "Quote Details" : "Quote Confirmation"}
                    </p>
                    {mode != "details" ?
                        <div className="alert alert-success">
                            <img src={icons.success_tick} className='img-fluid' width={40} /> &nbsp; We have received your request. You can download the quote and wait till we will estimate and contact with
                            you
                        </div>
                        : ""}
                    {/* Main Body of Details */}
                    {loading == 0 && Object.keys(details).length > 0 ?
                        <Fragment>
                            <div className={`card mb-3`}>
                                <div className="card-body pb-0">
                                    <h5 className="mb-3">Pickup Location Details</h5>
                                    <table className='table table-sm table-striped'>
                                        <thead>
                                            <tr>
                                                <th>From Location:</th>
                                                <th>To Location: </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td>
                                                    <div>{details.from_location}</div>
                                                    <div>
                                                        {(() => {
                                                            if (typeof details.floor_details.from_floor !== 'undefined') {
                                                                return (
                                                                    <Fragment>
                                                                        <span className='badge badge-default'>From floor: {details.floor_details.from_floor}</span>
                                                                        {
                                                                            details.floor_details.from_lift === 1 ? 
                                                                                <small className='badge badge-success'>Lift available</small> :
                                                                                <small className='badge badge-danger'>Lift unavailable</small>
                                                                        }
                                                                    </Fragment>
                                                                )
                                                            }
                                                        })()}
                                                    </div>
                                                </td>
                                                <td>
                                                    <div>{details.to_location}</div>
                                                    <div>
                                                        {(() => {
                                                            if (typeof details.floor_details.to_floor !== 'undefined') {
                                                                return (
                                                                    <Fragment>
                                                                        <span className='badge badge-default'>From floor: {details.floor_details.to_floor}</span>
                                                                        {
                                                                            details.floor_details.to_lift === 1 ? 
                                                                                <small className='badge badge-success'>Lift available</small> :
                                                                                <small className='badge badge-danger'>Lift unavailable</small>
                                                                        }
                                                                    </Fragment>
                                                                )
                                                            }
                                                        })()}
                                                    </div>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                            <div className="card mb-3">
                                <div className="card-body pb-0">
                                    <h5 className="mb-3">
                                        {details.user_type == "registered" ?
                                            <img title='Registered User' src={icons.verified} width={20} className='img-fluid mb-1' />
                                            : "(Guest)"}
                                        &nbsp; User Details
                                    </h5>
                                    <table className="table table-striped table-sm">
                                        <thead>
                                            <tr>
                                                <th>Full Name:</th>
                                                <th>Email: </th>
                                                <th>Mobile: </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td><strong>{details.fullname}</strong></td>
                                                <td>{details.email}</td>
                                                <td>{details.mobile}</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                            <div className="card mb-3">
                                <div className="card-body pb-0">
                                    <h5 className="mb-3">Selected Service</h5>
                                    <table className="table table-striped table-sm" style={{ marginBottom: '0' }}>
                                        <thead>
                                            <tr>
                                                <th>Service Name:</th>
                                                <th>Category Name: </th>
                                                <th></th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {(() => {
                                                if (details.service.category && details.service.category.length > 0) {
                                                    return (
                                                        details.service.category.map((category, key) => {
                                                            return (
                                                                <tr key={key}>
                                                                    <td>
                                                                        {key == 0 ?
                                                                            <span>{details.service.name}</span>
                                                                            : ""}
                                                                    </td>
                                                                    <td>{category.name}</td>
                                                                    <td>
                                                                        <ul>
                                                                            {(() => {
                                                                                if (Object.keys(category.items).length > 0) {
                                                                                    return (
                                                                                        category.items.map((item, key) => {
                                                                                            return (
                                                                                                <li className="list-group-item py-1 px-2" key={key}>
                                                                                                    {item.item.name} ({item.item.count} qty.)
                                                                                                </li>
                                                                                            )
                                                                                        })
                                                                                    )
                                                                                }
                                                                            })()}
                                                                        </ul>
                                                                    </td>
                                                                </tr>
                                                            )
                                                        })
                                                    )
                                                }
                                            })()}
                                        </tbody>
                                    </table>
                                </div>
                                <div className="card-body pb-0">
                                    <h5 className="mb-3">Provides Custom Service Items:</h5>
                                    {
                                        typeof details.custom_item_list !== 'undefined' ?
                                            <p>{details.custom_item_list}</p>
                                            :
                                            <p>No Items Provided</p>
                                    }
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-md-6 col-sm-12">
                                    <div className="card mb-1">
                                        <div className="card-body">
                                            <h5 className="mb-3">Additional Services</h5>
                                            <hr />
                                            <ul className='list mx-0'>
                                                {(() => {
                                                    if (Object.keys(details.additional_services).length > 0) {
                                                        return (
                                                            Object.keys(details.additional_services).map((addl, key) => {
                                                                return (
                                                                    <li className="list-group-item py-1 px-2 m-0" key={key}>
                                                                        {details.additional_services[addl].name} &nbsp;&nbsp;
                                                                        {(() => {
                                                                            if (typeof details.additional_services[addl].extra !== 'undefined' && details.additional_services[addl].extra > 0) {
                                                                                return (
                                                                                    <Fragment>
                                                                                        <span className='badge badge-success'>
                                                                                            {(() => {
                                                                                                if (details.additional_services[addl].type === 'porter') {
                                                                                                    return (
                                                                                                        <Fragment>
                                                                                                            Porters Requested: {details.additional_services[addl].extra}
                                                                                                        </Fragment>
                                                                                                    )
                                                                                                } else if (details.additional_services[addl].type === 'storage') {
                                                                                                    return (
                                                                                                        <Fragment>
                                                                                                            Storage Requested for: {details.additional_services[addl].extra} weeks
                                                                                                        </Fragment>
                                                                                                    )
                                                                                                }
                                                                                            })()}
                                                                                        </span>
                                                                                    </Fragment>
                                                                                )
                                                                            }
                                                                        })()}
                                                                    </li>
                                                                )
                                                            })
                                                        )
                                                    }
                                                })()}
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-6 col-sm-12">
                                    <div className="card mb-3">
                                        <div className="card-body pb-0">
                                            <h5 className="mb-3">Pickup Details</h5>
                                            <table className="table table-striped table-sm">
                                                <thead>
                                                    <tr>
                                                        <th>Pickup Type:</th>
                                                        <th>Pickup Date: </th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    <tr>
                                                        <td> {details.pickup_details.name} </td>
                                                        <td> {details.pickup_details.date} </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="card mb-3">
                                <div className="card-body pb-0">
                                    <h5 className="mb-3">Special Instructions</h5>
                                    <hr />
                                    <p>{details.instruction}</p>
                                </div>
                            </div>
                            <div className='button-row'>
                                <a href={`${api_baseurl}/service/${id}/quote-generate?mode=stream`} target={'_blank'} rel="noreferrer" className='btn btn-md reset_btn hvr-bounce-to-right pull-left'>
                                    <i className="fa fa-eye" aria-hidden="true"></i> View Quote
                                </a>
                                <a href={`${api_baseurl}/service/${id}/quote-generate?mode=download`} target={'_blank'} rel="noreferrer" className='btn btn-md instant_btn hvr-bounce-to-right pull-right'>
                                    <i className="fa fa-download" aria-hidden="true"></i> Download Quote
                                </a>
                            </div>
                        </Fragment>
                        : ""}
                </div>
            </section>
        </>
    )
}

export default QuoteConfirmation
