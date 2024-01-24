import React from 'react'
import Image from 'next/image'

const SingleOrderItemDetails = ({ item, key, price_params }) => {
    return (
        <>
            {(() => {
                if (item.short_packing && typeof item.short_packing !== 'undefined') {
                    return (
                        <div className="row my-3">
                            <div className="col">
                                <div className="card card-2">
                                    <div className="card-body p-0">
                                        <div className="media p-4">
                                            <div className="sq align-self-center ">
                                                <Image src={item.short_packing.images[0].image_url} className="img-fluid my-auto align-self-center mr-2 mr-md-4 pl-0 p-0 m-0" width={80} height={80} layout={'fixed'} />

                                            </div>
                                            <div className="media-body my-auto text-right">
                                                <div className="row my-auto flex-column flex-md-row">
                                                    <div className="col my-auto">
                                                        <h6 className="mb-0"> {item.short_packing.name} </h6>
                                                    </div>
                                                    <div className="col my-auto"> <small>Qty : {item.quantity}</small>
                                                    </div>
                                                    <div className="col my-auto">
                                                        <h6 className="mb-0"> {price_params.currency.symbol}{item.price}</h6>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <hr className="my-1" />
                                        <div className="row my-2 mx-2">
                                            <div className="col-md-12"><strong>Order Status:</strong> Completed</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )
                }
            })()}

        </>
    )
}

export default SingleOrderItemDetails
