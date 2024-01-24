import React, { useState, useEffect } from 'react'
// Next Extns
import Head from 'next/head'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/router'
// import './PackingMaterial.css'
import axios from '../../services/axios'
import { cart_total, uuid, load_to_top, format, set_storage } from '../../services/helper'
import { icons, covers } from '../../services/data'
// Manage State
import { useSelector, useDispatch } from 'react-redux'
import { addTocart } from '../../redux/CartSlice';
// Toaster
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Header from '../../components/Layouts/Header'
import Footer from '../../components/Layouts/Footer'
import Breadcrumb from '../../components/Common/Breadcrumb'
import TopBanner from '../../components/Common/TopBanner'
import MetaTags from '../../components/Common/MetaTags'

const Packings = ({ packings }) => {
    const router = useRouter()
    // State
    const dispatch = useDispatch();
    const cart_details = useSelector((state) => state.CartSlice);

    // const [packings, setPackings] = useState([]);
    const [cartStats, setCartStats] = useState([]);
    const [loading, setLoading] = useState(0);
    const [reset, setReset] = useState("");
    // const [details, setDetails] = useState([]);

    // Toaster
    const notify = (status, message) => {
        status == 1 ? toast.success(message) : toast.error(message)
    };

    const crumbs = () => {
        return [
            { name: "Item Packaging", path: "", hasRedirect: false },
        ]
    }

    useEffect(() => {
        document.title = "One Place 2 Save: Packing Items"
        getAllPacking()
        const cart_stats = cart_total(cart_details.products);
        setCartStats(cart_stats)

        // On load scroll to top
        load_to_top()
        return () => {
            // cleanup
        }
    }, [reset])

    const getAllPacking = async () => {
        // setLoading(1);
        // const initApi = await axios.get('packagings');
        // const getData = await initApi.data.data;
        // setPackings(getData);
        // setSelectedStorages(getData[0]);
        // setLoading(0);
    }

    const handleOnLinkClick = (id) => {
        set_storage('to_scroll', 1)
        router.push('/packing-material/' + id)
    }

    const handleAddTocart = (product) => {
        const ifExist = cart_details.products.find(item => item.id == product.id)
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
                <title>Purchase Storages</title>
                <link rel="stylesheet" href="/css/packing.css" />
                <MetaTags title='Contact Us' description='We have a large range of boxes and other packing materials, available with free delivery' url={'packing-material'} image="" />
            </Head>
            <TopBanner title={'Packing Materials'} banner='packing' />

            {/* <!-- Breadcrumb start --> */}
            <Breadcrumb crumbs={crumbs} cartStats={cartStats} rightBlock={true} />
            {/* <!-- Breadcrumb end --> */}

            <section className="packaging">
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
                        {(() => {
                            if (packings && packings.length > 0) {
                                return (
                                    packings.map((item, index) => {
                                        return (
                                            <div className="col-md-3" key={index}>
                                                <div className="carde card1">
                                                    <span className="link" onClick={() => handleOnLinkClick(item.id)}>
                                                        <Image src={typeof item.images[0] !== 'undefined' ? item.images[0] : '/images/no-image-found.jpg'} layout='responsive' width={'100%'} height={'100%'} className="img1 card-img-top" alt="Card image cap" />
                                                    </span>
                                                    <h5 className="card-title">
                                                        <span className="link" onClick={() => handleOnLinkClick(item.id)}>
                                                            {item.name}
                                                        </span>
                                                    </h5>
                                                    <h4 className="price">  {item.currency} {item.price}  </h4>
                                                    <span onClick={() => handleAddTocart(item)} className="btn btn-sm instant_btn hvr-bounce-to-right">
                                                        <i className="fa fa-shopping-cart" aria-hidden="true"></i> Add To Cart
                                                    </span>
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
                            <Link href={'/storages'}>
                                <a>
                                    <Image src={covers.ad_storage_space} height={'245px'} width={'1440px'} layout='responsive' />
                                </a>
                            </Link>
                        </div>
                    </div>
                </div>
                <ToastContainer
                    position="bottom-right"
                    autoClose={5000}
                    hideProgressBar={false}
                    newestOnTop={false}
                    closeOnClick
                    rtl={false}
                    pauseOnFocusLoss
                    draggable
                    theme={'colored'}
                    pauseOnHover />
            </section>
        </>
    )
}

export default Packings

// Server Side Fetching
export async function getStaticProps() {
    // const siteData = await masterData();
    const packings = await getPackingData();
    return {
        props: {
            packings,
            // services: siteData.services,
            // settings: siteData.settings[0]
        },
        revalidate: 10
    }
}
const getPackingData = async () => {
    const initApi = await axios.get('packagings');
    const getData = await initApi.data.data;
    return getData
}

// // Get Master Data
// const masterData = async () => {
//     const callApi = await axios.get('site-settings');
//     const getData = await callApi.data;
//     if (getData.status == 1) {
//         return getData.data
//     }
// }