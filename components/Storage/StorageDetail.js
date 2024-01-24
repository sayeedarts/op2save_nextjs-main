import React, { useState } from 'react'
import { encrypt, decrypt } from '../../services/helper'
import { price_params } from '../../services/data'
import ReactDOM from 'react-dom'
import axios from '../../services/axios';
// Player
import ReactPlayer from 'react-player'


// const PayPalButton = window.paypal.Buttons.driver("react", { React, ReactDOM });

const StorageDetail = (props) => {
    const storageInfo = props.data;
    const [purchaseInfo, setPurchaseInfo] = useState();
    const [playing, setPlaying] = useState(true)

    const handlePlaying = (status) => {
        if (status == 'play') setPlaying(true)
        if (status == 'pause') setPlaying(false)
        
    }

    return (
        <>
            <section className="mt-3">
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-md-5 text-center">
                            {(() => {
                                if (storageInfo.file) {
                                    return (
                                        <div className="row">
                                            <div className="col-12">
                                                <ReactPlayer url={storageInfo.file} playing={playing} width={320} height={200} />
                                            </div>
                                            {/* <div className="col-6 text-right">
                                                <span className="vid-links link" onClick={() => handlePlaying('play')}>Play again</span>
                                            </div>
                                            <div className="col-6 text-left">
                                                <span className="vid-links link" onClick={() => handlePlaying('pause')}>Pause</span>
                                            </div> */}
                                        </div>
                                    )
                                }
                            })()}
                        </div>
                        <div className="col-md-6">
                            <h3><b> {storageInfo.name}</b></h3>
                            {/* <h6><b>Area: {storageInfo.area}</b></h6> */}
                            <h6><b>Dimension: {storageInfo.dimension}</b></h6>

                            <h5><b> {price_params.currency.symbol}{storageInfo.price} {storageInfo.currency}</b>per week</h5>
                            <small>(Price will be applicable per-week time slot. Accordingly you will also get total price of the Storage.)</small>
                            <div className='my-3'></div>
                            <h6>Description:</h6>
                            <p> {storageInfo.description} </p>

                            <button className="btn btn-md instant_btn hvr-bounce-to-right" type="button" onClick={() => props.toggleStep('step-2')}>
                                <i className="fa fa-arrow-right"></i> Select & Proceed
                            </button>
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}

export default StorageDetail
