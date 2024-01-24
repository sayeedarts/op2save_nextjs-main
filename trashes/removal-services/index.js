import React, { Fragment } from 'react'
// Next Extn
import Head from 'next/head'
import Link from 'next/link'
import Image from 'next/image'

import { covers } from '../../services/data'
import axios from '../../services/axios'
import Header from '../../components/Layouts/Header'
import Footer from '../../components/Layouts/Footer'
import MetaTags from '../../components/Common/MetaTags'
import TopBanner from '../../components/Common/TopBanner'

const Services = ({ removal_services }) => {
    const pageTitle = "Removal Services"
    return (
        <>
            <Head>
                <title> {pageTitle} </title>
                <MetaTags title={pageTitle} description={'Looking for a quality and reliable man and van in London? Our one-stop multi-service company is family run and has been providing great value London removals since 2008'} tags={'Man and Van | London Removals | OnePlace2Save Mutli Service Company'} url={''} image={`${process.env.NEXT_PUBLIC_APP_URL}images/seo/home-group-photo.jpg`} />
            </Head>
            <TopBanner title={'Removal Services'} />
            <section className="contact-us">
                <div className="container">
                    <Fragment>
                        <div className="row mb-5">
                            {(() => {
                                if (removal_services && (removal_services).length > 0) {
                                    return (
                                        (removal_services).map((service, key) => {
                                            if ((service.display_type === 'both' || service.display_type === 'quotation')) {
                                                return (
                                                    <div className="col-lg-4 col-md-4 col-sm-4 col-xs-4 mt-4 pt-2" key={key}>
                                                        <div className="blog-post rounded border">
                                                            <div className="blog-img d-block overflow-hidden position-relative">
                                                                {/* <Link href={`/removal-services/${service.slug}`} passHref> */}
                                                                    <Image src={service.image} className='img-fluid rounded-top link' height={'70%'} width={'100%'} layout='responsive' />
                                                                {/* </Link> */}
                                                                <div className="overlay rounded-top bg-dark"></div>
                                                            </div>
                                                            <div className="content p-3 text-center">
                                                                <small className="text-muted p float-right">{service.added_on}</small>
                                                                <h5 className="mt-2">
                                                                    <Link href={`/removal-services/${service.slug}`}>
                                                                        <a className='link text-dark'>{service.title}</a>
                                                                    </Link>
                                                                </h5>
                                                                <Link href={`/request-quote/${service.slug}`}>
                                                                    <a className='btn btn-outline-secondary' style={{ borderRadius: '20px' }}>Request Quote</a>
                                                                </Link>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )
                                            }
                                        })
                                    )
                                }
                            })()}
                        </div>
                    </Fragment>
                </div>
            </section>
        </>
    )
}

export default Services

// Server Side Fetching
export const getServerSideProps = async (context) => {
    // const siteData = await masterData();
    const removalServices = await services()
    return {
        props: {
            removal_services: removalServices,
            // services: siteData.services,
            // settings: siteData.settings[0]
        },
    }
}

// // Get Master Data
// const masterData = async () => {
//     const callApi = await axios.get('site-settings');
//     const getData = await callApi.data;
//     if (getData.status == 1) {
//         return getData.data
//     }
// }

// Get Services
const services = async () => {
    const callApi = await axios.get('service/all');
    const getData = await callApi.data;
    if (getData.status == 1) {
        return getData.data
    }
    return [];
}
