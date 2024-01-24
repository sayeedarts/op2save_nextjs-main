import React from 'react'
import { date_diff, week_diff, date_format } from '../../../services/helper'

const StorageSingleItemDetails = ({ storage_order, price_params }) => {
    console.log(storage_order);
    return (
        <>
            <div className="row my-3">
                <div className="col">
                    <div className="card card-2">
                        <div className="card-body p-0">
                            <div className="media p-4">
                                <div className="media-body my-auto text-right">
                                    <div className="row my-auto flex-column flex-md-row">
                                        <div className="col my-auto">
                                            <h6 className="mb-0"> {storage_order.storage.name}</h6>
                                        </div>
                                        <div className="col my-auto"> <small>Qty : 1</small></div>
                                        <div className="col my-auto">
                                            <h6 className="mb-0"> {price_params.currency.symbol} {storage_order.storage.price}</h6>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <hr className="my-1" />
                            <div className="row my-3 mx-2">
                                <div className="col-md-12">
                                    <strong>Storage summary:</strong>
                                    <p>You have choosed to keep the Storage from <strong>{date_format(storage_order.start_date)}</strong> to <strong>{date_format(storage_order.end_date)}</strong> which is total of <strong>{week_diff(storage_order.start_date, storage_order.end_date)} Week(s)</strong>.</p>
                                </div>
                                <div className="col-md-12">
                                    <strong>Order Status:</strong> Completed
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default StorageSingleItemDetails
