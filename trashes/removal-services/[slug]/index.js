import React from 'react'
// Next Extn
import { useRouter } from 'next/router'
import Head from 'next/head'
import Link from 'next/link'

import { covers } from '../../../services/data'
import axios from '../../../services/axios'
import Header from '../../../components/Layouts/Header'
import Footer from '../../../components/Layouts/Footer'
import MetaTags from '../../../components/Common/MetaTags'
import TopBanner from '../../../components/Common/TopBanner'

/**
 * Show Request a Quote Button
 * @param {*} param0 
 * @returns 
 */
const RequestQuoteBtn = ({ slug, floating = false }) => {
    return (
        <Link href={`/request-quote/${slug}`}>
            {floating === true ?
                <div className="center link">
                    <a>Request Quote</a>
                </div>
                :
                <a className='btn btn-outline-danger float-right'>
                    <i className='fa fa-paper-plane'></i> Request Quote
                </a>
            }
        </Link>
    )
}

const ServiceDetails = ({ details, metadata }) => {
    const router = useRouter()
    if (router.isFallback) {
        return <div>Loading... Please wait...</div>
    }
    return (
        <>
            <Head>
                <title> Removal Service: {details.title} </title>
                <link rel="stylesheet" href="/css/packing.css" />
                <MetaTags title={metadata.title} description={metadata.description} tags={'Man and Van | London Removals | OnePlace2Save Mutli Service Company'} url={''} image={metadata.image} />
            </Head>
            <TopBanner title={'Removal Service'} />

            <section className="contact-us">
                <div className="container">
                    <p className="title title-lg ">{details.title}</p>
                    <div className='row'>
                        <div className="col-12 mb-3">
                            <button className='btn btn-sm btn-default' onClick={(e) => { router.back() }}>
                                <i className='fa fa-long-arrow-left'></i> Back to List
                            </button>
                            <RequestQuoteBtn slug={details.slug} />
                        </div>
                        <div className="col-lg-12 col-md-12">
                            <div className="post__content" dangerouslySetInnerHTML={{ __html: details.content }}></div>
                        </div>
                    </div>
                    <p className="title title-lg ">Service Categories</p>
                    <div className='row'>
                        {(() => {
                            if (details.category && (details.category).length > 0) {
                                const categoryList = details.category
                                return (
                                    categoryList.map((item, key) => {
                                        return (
                                            <div className='col-sm-4 mb-3' key={key}>
                                                <Link href={`/removal-services/${details.slug}/${item.slug}`}>
                                                    <a>
                                                        <div className='category_pill'>
                                                            <img src={item.icon_url} className='img-responsive mr-2 text-white' />
                                                            {item.title}
                                                        </div>
                                                    </a>
                                                </Link>

                                            </div>
                                        )
                                    })
                                )
                            }
                        })()}


                    </div>
                </div>
            </section>
            <RequestQuoteBtn slug={details.slug} floating={true} />
        </>
    )
}

export default ServiceDetails

// Generation of SSR
export async function getStaticPaths() {
    const slugs = await getAllSlugs();
    const getSlugs = slugs.map((slug) => {
        return {
            params: {
                slug: `${slug.slug}`
            }
        }
    });
    return {
        paths: getSlugs,
        fallback: true,
    }
}
// Server Side Fetching
export async function getStaticProps(context) {
    const { params } = context
    // const siteData = await masterData();
    const getServiceDetails = await serviceDetails(params.slug)
    return {
        props: {
            details: getServiceDetails.data,
            metadata: getServiceDetails.metadata,
            // services: siteData.services,
            // settings: siteData.settings[0]
        },
        revalidate: 10
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
const serviceDetails = async (slug) => {
    const callApi = await axios.get(`service/${slug}/details`);
    const getData = await callApi.data;
    if (getData.status == 1) {
        return getData
    }
    return [];
}

// Get Service Slugs
const getAllSlugs = async () => {
    const callApi = await axios.get(`service/slugs/with-child`);
    const getData = await callApi.data;
    if (getData.status == 1) {
        return getData.data
    }
    return [];
}