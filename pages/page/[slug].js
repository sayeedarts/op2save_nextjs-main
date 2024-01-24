import React from 'react'
import axios from '../../services/axios'
// Next Extn
import Head from 'next/head'

import { covers } from '../../services/data'
import MetaTags from '../../components/Common/MetaTags'
import TopBanner from '../../components/Common/TopBanner'

const StaticPage = ({ details }) => {
    return (
        <>
            <Head>
                <title> {details.metadata.title} </title>
                <link rel="stylesheet" href="/css/packing.css" />
                <MetaTags 
                    title={details.metadata.title} 
                    description={details.metadata.description} 
                    tags={'Man and Van | London Removals | OnePlace2Save Mutli Service Company'} 
                    url={''} 
                    image={`${details.metadata.image}`} />
            </Head>
            <TopBanner title={'Pages'} />
            <section className="contact-us animate__animated animate__slideInUp">
                <div className="container">
                    <p className="title title-lg ">{details.title}</p>
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
    const getBlogDetails = await blogsDetails(slug)
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