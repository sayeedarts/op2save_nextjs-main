import React from 'react'
// Next Extn
import { useRouter } from 'next/router'
import Head from 'next/head'
import Link from 'next/link'

import { covers } from '../../services/data'
import axios from '../../services/axios'
import Header from '../../components/Layouts/Header'
import Footer from '../../components/Layouts/Footer'
import TopBanner from '../../components/Common/TopBanner'
import MetaTags from '../../components/Common/MetaTags'

const ServiceCategoryDetails = ({ details, current_route }) => {
    const router = useRouter()
    const { slug, categorySlug } = router.query
    if (router.isFallback) {
        return <div>Loading... Please wait...</div>
    }
    return (
        <>
            <Head>
                <title> {details.metadata.title != "" ? details.metadata.title : details.title} </title>
                <MetaTags 
                    title={details.metadata.title} 
                    description={details.metadata.description} 
                    keywords={details.metadata.keywords} 
                    url={current_route} 
                    />
            </Head>
            {/* <TopBanner title={'Removal Service'} /> */}

            <section className="inner-banner my-5">

            </section>
            <section className="container">
                <nav aria-label="breadcrumb" className="main-breadcrumb">
                    <ol className="breadcrumb">
                        <li className="breadcrumb-item">
                            <Link href={'/'}><a>Home</a></Link>
                        </li>
                        <li className="breadcrumb-item"><a href="javascript:void(0)"> {details.service.title} </a></li>
                        <li className="breadcrumb-item active" aria-current="page"> {details.title} </li>
                    </ol>
                </nav>
                {/* <p className="title title-lg ">{details.title}</p> */}
                <div className='row'>
                    <div className="col-12 my-3">
                        <button className='btn btn-sm btn-default' onClick={(e) => { router.back() }}>
                            <i className='fa fa-long-arrow-left'></i> Back to List
                        </button>
                    </div>
                    <div className="col-lg-12 col-md-12">
                        <div className="post__content" dangerouslySetInnerHTML={{ __html: details.content }}></div>
                    </div>
                </div>
                {/* <p className="title title-lg ">Category Items</p>
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
                    </div> */}
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
    const current_route = params.slug + "/" + params.categorySlug;
    const getServiceCategoryDetails = await serviceCategoryDetails(params.categorySlug);
    if (!getServiceCategoryDetails) {
        return {
            notFound: true,
        }
    }
    return {
        props: {
            details: getServiceCategoryDetails[0],
            current_route: current_route
            // services: siteData.services,
            // settings: siteData.settings[0]
        },
        revalidate: 10
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
