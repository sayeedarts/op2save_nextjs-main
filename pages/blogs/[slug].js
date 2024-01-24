import React from 'react'
import axios from '../../services/axios'
import { covers } from '../../services/data'
// Next Extn
import Head from 'next/head'
import { useRouter } from 'next/router'
import Header from '../../components/Layouts/Header'
import Footer from '../../components/Layouts/Footer'
import MetaTags from '../../components/Common/MetaTags'
import TopBanner from '../../components/Common/TopBanner'

const Blogs = ({ details }) => {
    const router = useRouter()
    return (
        <>
            <TopBanner title={'Blogs'} />

            {typeof details !== 'undefined' ?
                <>
                {/* Wait till the data loads then we will show the metadata */}
                    {(() => {
                        if (details.metadata) {
                            return (
                                <>
                                    <Head>
                                        <title>{details.metadata.title}</title>
                                        <MetaTags
                                            title={details.metadata.title}
                                            description={details.metadata.description}
                                            keywords={details.metadata.keywords}
                                            url={''}
                                            image={`${details.metadata.image}`} />
                                    </Head>
                                </>
                            )
                        } else {
                            return (
                                <>
                                    <title>Blog: Oneplace2save</title>
                                </>
                            )
                        }
                    })()}

                    <section className="contact-us animate__animated animate__slideInUp">
                        <div className="container">
                            <p className="title title-lg ">{details.name}</p>

                            <div className="row">
                                <div className="col-12 mb-3">
                                    <button className='btn btn-sm btn-default' onClick={() => router.back()}>
                                        <i className='fa fa-long-arrow-left'></i> Back to List
                                    </button>
                                </div>
                                <div className="col-lg-12 col-md-12">
                                    <img src={details.asset} className='img-fluid mb-5' style={{
                                        width: '100%',
                                        height: '300px',
                                        objectFit: 'cover'
                                    }} />
                                </div>
                                <div className="col-12">
                                    <ul className="post-meta list-inline">
                                        <li className="list-inline-item">
                                            <i className="fa fa-user-circle-o"></i> <a href="#">OnePlace2Save</a>
                                        </li>
                                        <li className="list-inline-item">
                                            <i className="fa fa-calendar-o"></i> <a href="#"> {details.created_at} </a>
                                        </li>
                                    </ul>
                                </div>
                                <div className="col-lg-12 col-md-12">
                                    <div className="post__content" dangerouslySetInnerHTML={{ __html: details.content }}></div>
                                </div>
                            </div>
                        </div>
                    </section>
                </>
                : ''}
        </>
    )
}

export default Blogs

export async function getStaticPaths() {
    const slugs = await getBlogSlugs();
    const getSlugs = slugs.map((slug) => {
        return {
            params: {
                slug: `${slug}`
            }
        }
    })
    return {
        paths: getSlugs,
        fallback: true,
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
            details: getBlogDetails[0]
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
const blogsDetails = async (slug) => {
    const callApi = await axios.get(`blogs/${slug}`);
    const getData = await callApi.data;
    if (getData.status == 1) {
        return getData.data
    }
    return null;
}

const getBlogSlugs = async () => {
    const callApi = await axios.get(`blogs/slugs`);
    const getData = await callApi.data;
    if (getData.status == 1) {
        return getData.data
    }
    return [];
}
