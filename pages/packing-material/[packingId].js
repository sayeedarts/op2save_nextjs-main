import React, { useState, useEffect } from 'react'
// import styles from './PackingMaterial.module.css'
// Next Extn
import { useRouter } from 'next/router'
import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'

import TopBanner from '../../components/Common/TopBanner'

// import './PackingMaterial.css'
// import { useParams } from "react-router-dom";
import axios from '../../services/axios'
import { icons, covers, price_params } from '../../services/data'
import { cart_total, uuid, load_to_top as LTT } from '../../services/helper'
// Manage State
import { useSelector, useDispatch } from 'react-redux'
import { addTocart } from '../../redux/CartSlice';
// Toaster
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Carousel
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from 'react-responsive-carousel';
import { route } from 'next/dist/server/router'
import Breadcrumb from '../../components/Common/Breadcrumb'
import MetaTags from '../../components/Common/MetaTags'


const PackingDetails = ({ details }) => {
    console.log(details.metadata);
    const router = useRouter()
    const packingId = router.query.packingId

    const dispatch = useDispatch();
    const cart_details = useSelector((state) => state.CartSlice);

    const [loading, setLoading] = useState(0);
    const [reset, setReset] = useState("");
    const [quantity, setQuantity] = useState(1);

    // Toaster
    const notify = (status, message) => {
        status == 1 ? toast.success(message) : toast.error(message)
    };

    const [cartStats, setCartStats] = useState([]);
    const crumbs = () => {
        return [
            { name: "Item Packaging", path: "/packing-material", hasRedirect: true },
            { name: details.name, path: "", hasRedirect: false },
        ]
    }

    useEffect(() => {
        const cart_stats = cart_total(cart_details.products);
        setCartStats(cart_stats)

        return () => {
            // setDetails([])
        }
    }, [reset])

    // const getPackingDetails = async (id) => {
    //     setLoading(1);
    //     const initApi = await axios.get('packaging/' + id + '/details');
    //     const getData = await initApi.data.data;
    //     if (typeof getData == "undefined") {
    //         history.push('/404')
    //     }
    //     setDetails(getData);

    //     setLoading(0);
    // }

    const gotoURL = (e, page) => {
        e.preventDefault()
        router.push(page)
    }

    const handleAddTocart = (e, selected = {}) => {
        e.preventDefault()
        // Check if same product exists
        const ifExist = (cart_details.products).find(item => item.id == details.id)

        if (typeof ifExist !== "undefined") {
            // If same product exists in the State
            notify(0, "Item already exists in Cart. Please go to Cart")
        } else {
            // Add product to the state
            dispatch(addTocart({
                product: details,
                quantity: quantity
            }))
            notify(1, "Product added to Cart")
        }

        setReset(uuid());
    }

    const handleRelatedAddtocart = (product) => {
        const ifExist = (cart_details.products).find(item => item.id == product.id)

        if (typeof ifExist !== "undefined") {
            // If same product exists in the State
            notify(0, "Item already exists in Cart. Please go to Cart")
        } else {
            // Add product to the state
            dispatch(addTocart({
                product: product,
                quantity: 1
            }))
            notify(1, "Product added to Cart")
        }

        setReset(uuid());
    }

    return (
        <>
            <Head>
                <title> {details.metadata.title} </title>
                <link rel="stylesheet" href="/css/packing.css" />
                {/* Metatags */}
                <MetaTags 
                    title={details.metadata.title} 
                    description={details.metadata.description} 
                    keywords={details.metadata.keywords} 
                    url={''} 
                    image={`${details.metadata.image}`} />
            </Head>

            <TopBanner title={'Packing Materials'} banner='packing' />

            {/* <!-- Breadcrumb start --> */}
            <Breadcrumb crumbs={crumbs} cartStats={cartStats} rightBlock={true} />
            {/* <!-- Breadcrumb end --> */}

            <section className="packaging single-packaging">
                <div className="container">
                    {/* Loader */}
                    <div className="row">
                        <div className="col-sm-5"></div>
                        <div className={"col-sm-2 " + (loading == 1 ? "text-center " : "text-center d-none")}>
                            <img src={icons.truck_loader.default} className="img-fluid" alt="loader" />
                        </div>
                        <div className="col-sm-5"></div>
                    </div>
                    {/* End */}
                    <div className="row">
                        <div className="col-md-4">
                            <Carousel>
                                {(() => {
                                    if (details.images != null) {
                                        return (
                                            details.images.map((image, key) => {
                                                return (
                                                    <div key={key}>
                                                        <img src={image} className='slider_main_img' alt='Packing Images' />
                                                        {/* <p className="legend">Legend 1</p> */}
                                                    </div>
                                                )
                                            })
                                        )
                                    }
                                })()}
                            </Carousel>
                        </div>
                        <div className="col-md-8">
                            <h5 className="card-title">
                                {typeof details.name !== "undefined" ? details.name : ""}
                            </h5>
                            <h4 className="price">£ {details.price}</h4>
                            <p>{details.short_description}</p>
                            <p>
                                <strong>Category:</strong> {details.category} &nbsp;&nbsp;&nbsp;
                                {/* <strong>Tags:</strong> Medium Size Removal Boxes,  Packing, Removal, Removal Boxes */}
                            </p>
                            <div className="quantity">
                                <label className="screen-reader-text">Qty: &nbsp;</label>
                                <input type="number" className="input-text qty text" step="1" min="1" max="" name="" title="Qty"
                                    size="" placeholder="" inputMode='numeric' onChange={(e) => setQuantity(e.target.value)} value={quantity} />
                            </div>
                            <a href="" className="btn btn-sm instant_btn hvr-bounce-to-right" onClick={handleAddTocart}>
                                <i className="fa fa-shopping-cart" aria-hidden="true"></i> Add To Cart
                            </a>
                            <Link href={'/packing-material'}>
                                <a className="btn btn-sm reset_btn hvr-bounce-to-right ml-2">
                                    <i className="fa fa-chevron-circle-left" aria-hidden="true"></i>
                                    &nbsp; Back to List
                                </a>
                            </Link>
                        </div>
                    </div>
                    <div className='row'>
                        <div className='col-12 mt-5'>
                            <Link href={'/storages'}>
                                <a>
                                    <Image src={covers.ad_storage_space} height={'245px'} width={'1440px'} layout='responsive' />
                                </a>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            <section className="packaging pt-0">
                <div className="container">
                    <p className="related-title">Related Products</p>
                    <div className="row">
                        {(() => {
                            if (details.related && details.related.length > 0) {
                                return (
                                    details.related.map((related, key) => {
                                        return (
                                            <div className="col-md-3" key={key}>
                                                <div className="card card1">
                                                    <Link href={`/packing-material/${related.id}`} passHref>
                                                        <a>
                                                            <Image src={typeof related.images[0].image_url !== 'undefined' ? related.images[0].image_url : '/images/no-image-found.jpg'} layout='responsive' width={'100%'} height={'100%'} className="card-img-top img1" alt="Card image cap" />
                                                        </a>
                                                    </Link>
                                                    <h5 className="card-title">
                                                        <Link href={`/packing-material/${related.id}`} passHref>
                                                            <a>
                                                                {typeof related.name !== "undefined" ? related.name : ""}
                                                            </a>
                                                        </Link>
                                                    </h5>
                                                    <h4 className="price"> {price_params.currency.symbol} {related.price}</h4>
                                                    <span className="btn btn-sm instant_btn hvr-bounce-to-right" onClick={() => handleRelatedAddtocart(related)}>
                                                        <i className="fa fa-shopping-cart" aria-hidden="true"></i>
                                                        &nbsp; Add To Cart
                                                    </span>
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
            <ToastContainer autoClose={20000}/>
        </>
    )
}

export default PackingDetails

export async function getStaticPaths() {
    const Ids = await getPackingIds()
    const packingIds = Ids.map((id) => {
        return {
            params: {
                packingId: `${id}`
            }
        }
    })
    return {
        paths: packingIds,
        fallback: 'blocking',
    }
}

export async function getStaticProps(context) {
    const { params } = context
    // const siteData = await masterData();
    const details = await getPackingDetails(params.packingId)
    if (!details) {
        return {
            notFound: true,
        }
    }
    return {
        props: {
            details: details[0],
        },
        revalidate: 10
    }
}

// Get single Product Details
const getPackingDetails = async (id) => {
    const initApi = await axios.get(`packaging/${id}/details`);
    const getData = await initApi.data.data;
    return getData
}

// Get only Ids for SSR
const getPackingIds = async () => {
    const initApi = await axios.get(`packaging/ids`);
    const getData = await initApi.data.data;
    return getData
}