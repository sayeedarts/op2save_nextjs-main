import React from 'react'
import Link from 'next/link'
import Image from 'next/image'

const Services = ({ services }) => {
    return (
        <>
            <section className="what_we_do animate__fadeInUp animate__delay-2s">
                <div className="container">
                    <p className="text-center title"> What we do </p>
                    <div id="our_services" className="photo_gallery">
                        <div className="row">
                            {(() => {
                                if (Object.keys(services).length > 0) {
                                    const what_we_do_services = services.slice(0, 8)
                                    return (
                                        what_we_do_services.map((item, i) => {
                                            if (item.featured == 'yes' && (item.display_type === 'both' || item.display_type === 'quotation')) {
                                                return (
                                                    <div key={i} className="col-lg-3 col-md-6 col-sm-12 mb-4">
                                                        <div className="link">
                                                            <div className="photo_box">
                                                                <Link href={`/request-quote/${item.slug}`}>
                                                                    <a>
                                                                        <Image src={item.image} width={255} height={190} layout='responsive' priority='lazy' placeholder='empty' alt={item.title} />
                                                                        <p> {item.title} </p>
                                                                    </a>
                                                                </Link>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )
                                            }
                                        })
                                    )
                                }
                                return null;
                            })()}
                        </div>
                        <div className='row'>
                            <div className='col-12 text-center'>
                                <Link href={'/removal-services'}>
                                    <a className='btn btn-outline-secondary'>
                                        View all Services
                                    </a>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}

export default Services
