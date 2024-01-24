import React, { useEffect } from 'react'
import axios from '../../services/axios'
// Next Extn
import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'

import MetaTags from '../../components/Common/MetaTags'
import TopBanner from '../../components/Common/TopBanner'


/**
 * Show Request a Quote Button
 * @param {*} param0 
 * @returns 
 */
const RequestQuoteBtn = ({ info, floating = false }) => {
    const router = useRouter()
    useEffect(() => {
        // router.reload(window.location.pathname)
    }, [])
    let float_btn_link, float_btn_text = '';
    let right_spacing = 0;
    if (info.page_type === 'service'
        && (info.service_display_type === 'both' || info.service_display_type === 'quotation')
    ) {
        float_btn_link = `/request-quote/${info.slug}`;
        float_btn_text = "Request a Quote"
        right_spacing = -50
    } else {
        if (info.slug.match("storage-london")) {
            float_btn_text = "Buy Storage"
            float_btn_link = '/storages'
            right_spacing = -35
        }
    }

    if (float_btn_link !== '' && typeof float_btn_link !== 'undefined') {
        return (
            <>
                <Link href={float_btn_link}>
                    <a className="floating" style={{ 'right': `${right_spacing}px` }}>
                        <div className='rotate'>
                            <p className='btn btn-success m-0'> {float_btn_text} </p>
                        </div>
                    </a>
                </Link>
            </>
        )
    } else {
        return (
            <>

            </>
        )
    }
}

const StaticPage = ({ details }) => {
    return (
        <>
            <Head>
                <title> {details.metadata.title} </title>
                <link rel="stylesheet" href="/css/packing.css" />
                <MetaTags 
                    title={details.metadata.title} 
                    description={details.metadata.description} 
                    keywords={details.metadata.keywords} 
                    url={''} 
                    image={`${details.metadata.image}`} />
            </Head>
            <TopBanner title={details.title} banner='page' />
            {/* Floating Button */}
            <RequestQuoteBtn info={details} floating={true} />
            <section className="top-spacing animate__animated animate__slideInUp">
                <div className="container">
                    <div className="row">
                        <div className="col-12 mb-3">
                            <div className="post__content" dangerouslySetInnerHTML={{ __html: details.content }}></div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}

export default StaticPage

export async function getStaticPaths() {
    const slugs = await getPageSlugs();
    const getSlugs = slugs.map((slug) => {
        return {
            params: {
                slug: `${slug}`
            }
        }
    })
    return {
        paths: getSlugs,
        fallback: 'blocking',
    }
}

// Server Side Fetching
export async function getStaticProps(context) {
    const { slug } = context.params
    // const siteData = await masterData();
    const getBlogDetails = await blogsDetails(slug);
    if (!getBlogDetails) {
        return {
            notFound: true,
        }
    }
    return {
        props: {
            details: getBlogDetails,
        },
        revalidate: 10
    }
}

// Get Services
const blogsDetails = async (slug) => {
    const callApi = await axios.get(`page/${slug}`);
    const getData = await callApi.data;
    if (getData.status == 1) {
        return getData.data
    }
    return null;
}

const getPageSlugs = async () => {
    const callApi = await axios.get(`page-slug-list`);
    const getData = await callApi.data;
    if (getData.status == 1) {
        return getData.data
    }
    return [];
}