import React, { useEffect, Fragment } from 'react'
//Nextjs
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router'
import Common from './Common.module.css'

const RequestComplete = ({ quoteStatus }) => {
    const router = useRouter()
    const { heading, message, redirectTo, redirectText } = quoteStatus
    useEffect(() => {
        window.scrollTo(0, 0)
    }, [])
    return (
        <>
            {quoteStatus.status === 1 ?
                <Fragment>

                    <div className="success">
                        <div className="container">
                        <div className="success-box">
                            <h2>
                                <span>
                                    <i className="fa fa-check" aria-hidden="true"></i>
                                </span>
                                &nbsp; {heading}
                            </h2>
                            <p>{message} </p>
                            <Link href={redirectTo}>
                                <a className="success-btn">
                                    {redirectText}
                                </a>
                            </Link>
                        </div>
                        </div>
                    </div>

                    {/* <div className='alert alert-success'>
                        <div className='row'>
                            <div className='col-md-1 mt-2 pr-0 pl-4'>
                                <Image src='/assets/icons/tick.png' height={35} width={35} layout={'fixed'} alt='success' />
                            </div>
                            <div className='col-md-11 p-0'>
                                <div className='align-middle'>
                                    {heading} <br />
                                    {message} <br />
                                    <Link href={redirectTo}>
                                        <a>
                                            {redirectText}
                                        </a>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div> */}
                </Fragment>
                : "N/A"}
        </>
    )
}

export default RequestComplete
