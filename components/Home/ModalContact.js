import React, { useState } from 'react'
import Image from 'next/image'
import { Body } from '../ContactUs/Body'
// Manage State
import { useSelector, useDispatch } from 'react-redux'
import { toggleContactModal } from '../../redux/homeSlice';

export const ModalContact = () => {
    
    const dispatch = useDispatch();
    const toggle_contact_modal = useSelector((state) => state.homeSlice.toggle_contact_modal);
    
    const [modalState, setModalState] = useState(toggle_contact_modal)

    const handleModalClose = () => {
        dispatch(toggleContactModal({status: false}))
        setModalState(false)
    }

    return (
        <>
            <div className={"contact-modal modal fade" + (modalState ? " show d-block" : " d-none")} id="exampleModalCenter" tabIndex={-1} role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true" data-backdrop="static" data-keyboard="false">
                <div className="modal-dialog modal-lg modal-dialog-centered" role="document">
                    <div className="modal-content rounded-0">
                        <div className="modal-body py-0">
                            <div className="main-content">
                                <div className='row d-flex'>
                                    <div className='col-4' style={{ backgroundColor: '#f4f1ee', position: 'relative' }}>
                                        <Image src='/assets/vectors/women-using-laptop.svg' className='img-fluid-x' height={'80%'} width={'100%'} layout='fill'/>
                                    </div>
                                    <div className='col-8'>
                                        <div className="content-text p-4">
                                            <div className='text-right link' onClick={handleModalClose}>
                                                <i className='fa fa-times'></i>
                                            </div>
                                            <h3>Contact Us</h3>
                                            {/* <p>All their equipment and instruments are alive. The sky was cloudless and of a deep dark blue.</p> */}
                                            <Body />
                                        </div>
                                    </div>
                                </div>


                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
