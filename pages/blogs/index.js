import React, { Fragment } from 'react'
import axios from '../../services/axios'
import { covers } from '../../services/data'
// Next Extn
import Head from 'next/head'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/router'

import Header from '../../components/Layouts/Header'
import Footer from '../../components/Layouts/Footer'
import TopBanner from '../../components/Common/TopBanner'

const Blog = ({ query, blogs, pagination }) => {
    const router = useRouter()
    const paginateClick = (e, url) => {
        e.preventDefault()
        if (url != null) {
            let toPage = url.replace(pagination.path + '?page=', '')
            router.push(`/blogs?page=${toPage}`)
        }
    }

    const handleClick = (slug) => {
        router.push(`/blogs/${slug}`)
    }

    return (
        <>
            <Head>
                <title> {process.env.site_name}  </title>
                <link rel="stylesheet" href="/css/packing.css" />
            </Head>
            <TopBanner title={'Blogs'} />
            <section className="contact-us">
                <div className="container">
                    <Fragment>
                        <div className="row mb-5">
                            {(() => {
                                if (blogs && (blogs).length > 0) {
                                    return (
                                        (blogs).map((blog, key) => {
                                            return (
                                                <div className="col-lg-4 col-md-6 mt-4 pt-2" key={key}>
                                                    <div className="blog-post rounded border">
                                                        <div className="blog-img d-block overflow-hidden position-relative">
                                                            <Link href={`/blogs/${blog.slug}`} passHref>
                                                                <Image src={blog.asset_url} className="img-fluid rounded-top link" alt="blog" height={'70%'} width={'100%'} layout='responsive' />
                                                            </Link>
                                                            <div className="overlay rounded-top bg-dark"></div>
                                                        </div>
                                                        <div className="content p-3">
                                                            <small className="text-muted p float-right">{blog.added_on}</small>
                                                            <small><a href="javascript:void(0)" className="text-primary">Posted by Admin</a></small>
                                                            <h4 className="mt-2">
                                                                <a onClick={() => handleClick(blog.slug)} className="text-dark title-x link">
                                                                    {blog.name}
                                                                </a>
                                                            </h4>
                                                        </div>
                                                    </div>
                                                </div>
                                            )
                                        })
                                    )
                                }
                            })()}
                        </div>
                        <div className='row'>
                            <div className='col-12'>
                                <nav aria-label="Page navigation example">
                                    <ul className="pagination">
                                        {(() => {
                                            if (blogs && (blogs).length > 0) {
                                                return (
                                                    (pagination.links).map((link, key) => {
                                                        return (
                                                            <li className={'page-item ' + (link.active === true ? 'active' : '')} key={key}>
                                                                <a className="page-link" href="#" onClick={(e) => paginateClick(e, link.url)}>
                                                                    <span dangerouslySetInnerHTML={{ __html: link.label }}></span>
                                                                </a>
                                                            </li>
                                                        )
                                                    })
                                                )
                                            }
                                        })()}
                                    </ul>
                                </nav>
                            </div>
                        </div>
                    </Fragment>
                </div>
            </section>
        </>
    )
}

export default Blog

export const getServerSideProps = async (context) => {
    // Get Pagination info
    const { page } = context.query
    // Get Blogs
    const blogs = await paginatedBlog(page)
    // Site Settings
    // const siteData = await masterData();
    return {
        props: {
            query: context.query,
            blogs: blogs.data,
            pagination: {
                current_page: blogs.current_page,
                first_page_url: blogs.first_page_url,
                from: blogs.from,
                last_page: blogs.last_page,
                last_page_url: blogs.last_page_url,
                links: blogs.links,
                next_page_url: blogs.next_page_url,
                path: blogs.path,
                per_page: blogs.per_page,
                prev_page_url: blogs.prev_page_url,
                to: blogs.to,
                total: blogs.total,
            },
            // services: siteData.services,
            // settings: siteData.settings[0]
        }
    }
}

// Get Services
const paginatedBlog = async (page = 1) => {
    const callApi = await axios.get(`blogs?page=${page}`);
    const getData = await callApi.data;
    if (getData.status == 1) {
        return getData.data
    }
    return [];
}

// // Get Master Data
// const masterData = async () => {
//     const callApi = await axios.get('site-settings');
//     const getData = await callApi.data;
//     if (getData.status == 1) {
//         return getData.data
//     }
// }
