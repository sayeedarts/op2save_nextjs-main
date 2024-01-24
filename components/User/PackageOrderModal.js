import React, { useState, useEffect } from 'react'
import { price_params } from '../../services/data'
import SingleOrderItemDetails from './Orders/SingleOrderItemDetails';
import { to_readable_date, date_format } from '../../services/helper'
import { useSelector } from 'react-redux'

const PackageOrderModal = ({ order_details }) => {
    const settings = useSelector((state) => state.homeSlice.settings);
    const [vat, setvat] = useState(0)
    useEffect(() => {
        setvat(parseFloat(settings.vat))
    }, [vat])
    return (
        <>
            <div className="modal fade" id={'orderDetailsModal' + order_details.order_number} tabIndex={'-1'} aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog modal-lg" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="exampleModalLabel">Order #{order_details.order_number}</h5>
                            <button type="button" className="close" data-dismiss="modal"
                                aria-label="Close"><span aria-hidden="true">×</span></button>
                        </div>
                        <div className="modal-body">
                            <div className="row justify-content-between mb-3">
                                <div className="col-auto">
                                    <h6 className="color-1 mb-0 change-color">Receipt</h6>
                                </div>

                            </div>
                            {(() => {
                                if (order_details.packing_orders && order_details.packing_orders.length > 0) {
                                    return (
                                        order_details.packing_orders.map((item, key) => {
                                            return (
                                                <SingleOrderItemDetails item={item} key={key} price_params={price_params} />
                                            )
                                        })
                                    )
                                }
                            })()}
                            <div className="row mt-4">
                                <div className="col">
                                    <div className="row justify-content-between">
                                        <div className="col-auto">
                                            <p className="mb-1 text-dark"><b>Order Details</b></p>
                                        </div>
                                        <div className="flex-sm-col text-right col">
                                            <p className="mb-1"><b>VAT</b></p>
                                        </div>
                                        <div className="flex-sm-col col-auto">
                                            <p className="mb-1"> {price_params.currency.symbol}{vat} </p>
                                        </div>
                                    </div>
                                    <div className="row justify-content-between">
                                        <div className="flex-sm-col text-right col">
                                            <p className="mb-1"><b>Total</b></p>
                                        </div>
                                        <div className="flex-sm-col col-auto">
                                            <p className="mb-1"> {price_params.currency.symbol}{order_details.price_total} </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="row invoice ">
                                <div className="col">
                                    <p className="mb-1"> Payment via : Paypal Payment Gateway</p>
                                    <p className="mb-1">Purchase Date : {date_format(order_details.created_at)}</p>
                                </div>
                            </div>
                            <div className="card-footer">
                                <div className="jumbotron-fluid">
                                    <div className="row justify-content-between ">
                                        <div className="col-auto my-auto ">
                                            <h4 className="mb-0">TOTAL PAID</h4>
                                        </div>
                                        <div className="col-auto my-auto ml-auto">
                                            <h2> {price_params.currency.symbol}{order_details.price_total} </h2>
                                        </div>
                                    </div>
                                    {/* <div className="row mb-3 mt-3 mt-md-0">
                                        <div className="col-auto border-line"> <small
                                            className="text-black">PAN:AA02hDW7E</small></div>
                                        <div className="col-auto border-line"> <small
                                            className="text-black">CIN:UMMC20PTC </small></div>
                                        <div className="col-auto "><small className="text-black">GSTN:268FD07EXX
                                        </small> </div>
                                    </div> */}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default PackageOrderModal
