import React from 'react'
// Next Extn
import { useRouter } from 'next/router'
import Head from 'next/head'
import Link from 'next/link'


import { covers } from '../../../services/data'
import axios from '../../../services/axios'
import Header from '../../../components/Layouts/Header'
import Footer from '../../../components/Layouts/Footer'
import TopBanner from '../../../components/Common/TopBanner'

const ServiceCategoryDetails = ({ details }) => {
    const router = useRouter()
    const { slug, categorySlug } = router.query
    if (router.isFallback) {
        return <div>Loading... Please wait...</div>
    }
    return (
        <>
            <Head>
                <title> Removal Service: {details.title} </title>
                <link rel="stylesheet" href="/css/packing.css" />
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
                        </div>
                        <div className="col-lg-12 col-md-12">
                            <div className="post__content" dangerouslySetInnerHTML={{ __html: details.content }}></div>
                        </div>
                    </div>
                    <p className="title title-lg ">Category Items</p>
                    <div className='row'>
                        {(() => {
                            if (details.items && (details.items).length > 0) {
                                const categoryItems = details.items
                                return (
                                    categoryItems.map((item, key) => {
                                        return (
                                            <div className='col-sm-4 mb-3' key={key}>
                                                <div className='category_pill'>
                                                    <img src={item.icon_url} className='img-responsive mr-2 text-white' />
                                                    {item.title}
                                                </div>
                                            </div>
                                        )
                                    })
                                )
                            }
                        })()}
                    </div>
                </div>
            </section>
        </>
    )
}

export default ServiceCategoryDetails

export async function getStaticPaths() {
    const slugsWithChild = await getSlugsWithChild();
    let nested_routes = [];
    slugsWithChild.map((parent, i) => {
        if (typeof parent.child !== "undefined" && (parent.child).length > 0) {
            const childData = parent.child
            childData.map((ch, j) => {
                if (ch !== null) {
                    nested_routes.push({
                        params: { slug: parent.slug, categorySlug: ch.toString() }
                    });
                }
            })
        }
    });
    return {
        paths: JSON.parse(JSON.stringify(nested_routes)),
        fallback: true,
    }
}

export async function getStaticProps(context) {
    const { params } = context
    // const siteData = await masterData();
    const getServiceCategoryDetails = await serviceCategoryDetails(params.categorySlug)
    if (!getServiceCategoryDetails) {
        return {
            notFound: true,
        }
    }
    return {
        props: {
            details: getServiceCategoryDetails[0],
            // services: siteData.services,
            // settings: siteData.settings[0]
        },
    }
}

// Get Master Data
// const masterData = async () => {
//     const callApi = await axios.get('site-settings');
//     const getData = await callApi.data;
//     if (getData.status == 1) {
//         return getData.data
//     }
// }

// Get Services
const serviceCategoryDetails = async (categorySlug) => {
    const callApi = await axios.get(`service-category/${categorySlug}/details`);
    const getData = await callApi.data;
    if (getData.status == 1) {
        return getData.data
    }
    return [];
}

// Get Service Slugs
const getSlugsWithChild = async () => {
    const callApi = await axios.get('service/slugs/with-child');
    const getData = await callApi.data;
    if (getData.status == 1) {
        return getData.data
    }
    return [];
}
