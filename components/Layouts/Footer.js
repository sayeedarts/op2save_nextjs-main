import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'

import { useSelector, useDispatch } from 'react-redux'
import axios from '../../services/axios'
import { useRouter } from 'next/router'
import { uuid, set_storage, vat, clear_user_data } from '../../services/helper'
import { static_pages } from '../../services/data'
import { selectSlug, storeSettings, storeServices } from '../../redux/homeSlice';

import styles from '../Common/Common.module.css'

const Footer = ({ settings, services }) => {
    let dispatch = useDispatch();
    const whatsapp = '+447979855252';
    const router = useRouter()
    // const rx_services = useSelector((state) => state.homeSlice.servicex);
    const rx_settings = useSelector((state) => state.homeSlice.settings);
    const key = uuid();
    const handleFooterServiceLinks = (e, item) => {
        e.preventDefault()
        dispatch(selectSlug(item.slug))
        set_storage('to_scroll', 1)
        router.push(`/request-quote/${item.slug}`)
    }

    // const [settings, setSettings] = useState([]);
    // const [services, setServices] = useState([]);
    // const [refreshState, setRefreshState] = useState(0)
    useEffect(() => {
        getVat()
        // getRefreshState();
        // Fetch Settings and Services and store those in State for later use

        // Get Settings everytime the page loads
        // getMasterData()
        // setSettings(rx_settings)
        // setServices(rx_services)

        // To load settings Once
        // if ((Object.keys(rx_settings).length == 0 || Object.keys(rx_services).length == 0)) {
        //     getMasterData()
        // } else {
        //     setSettings(rx_settings)
        //     setServices(rx_services)
        // }

        // if (refreshState === 1) {
        //     handleLogout()
        // }
        return () => {
            // code
        }
    }, [])

    // Get Important Data from API like Vats
    const getVat = async () => {
        const callApi = await axios.get('site-imp-settings');
        const getData = await callApi.data;
        if (getData.status == 1) {
            dispatch(storeSettings({ vat: getData.data.vat }))
        }
    }

    // const getRefreshState = async () => {
    //     // http://localhost:8000/api/site/refresh-state
    //     const callApi = await axios.get('site/refresh-state');
    //     const getData = await callApi.data;
    //     if (getData.status == 1) {
    //         setRefreshState(getData.data)
    //     }
    // }

    // // get master settings
    // const getMasterData = async () => {
    //     const callApi = await axios.get('site-settings');
    //     const getData = await callApi.data;
    //     if (getData.status == 1) {
    //         dispatch(storeSettings(getData.data.settings[0]))
    //         dispatch(storeServices(getData.data.services))
    //         setSettings(getData.data.settings[0])
    //         setServices(getData.data.services)
    //     }
    // }

    const handleLogout = async () => {
        // await axios.post('/storage/payment', { data: request_payload })
        const callApi = await axios.get('site/reset-refresh-state');
        const getData = await callApi.data;
        if (getData.status == 1) {
            // console.log(getData.message);
        }
        clear_user_data();
        router.push('/auth/login')
    }

    return (
        <>
            {(() => {
                if (Object.keys(settings).length > 0) {
                    return (
                        <>
                            <footer className="footer">
                                <div className="container">
                                    <div className="row">
                                        <div className="col-lg-4 col-md-6 col-sm-12">
                                            <a href="\"><Image src={settings.brand.logo} height={53} width={237} layout='intrinsic'/></a>
                                            <div className="social_media">
                                                <a href={settings.twitter} rel="noreferrer" target={'_blank'}><i className="fa fa-twitter"></i></a>
                                                <a href={settings.facebook} rel="noreferrer" target={'_blank'}><i className="fa fa-facebook"></i></a>
                                                <a href={settings.instagram} rel="noreferrer" target={'_blank'}><i className="fa fa-instagram"></i></a>
                                                <a href={settings.youtube} rel="noreferrer" target={'_blank'}><i className="fa fa-youtube"></i></a>
                                                {/* <a href={`https://api.whatsapp.com/send?phone=${settings.phone.replace(/\s+/g, '')}&text=Hello%20OnePlace2Save!`} rel="noreferrer" target={'_blank'}><i className="fa fa-whatsapp"></i></a> */}
                                            </div>
                                            <div className="contact_number">
                                                <p dangerouslySetInnerHTML={{ __html: settings.address }}></p>
                                                <p>
                                                    Click Here to Call us
                                                    <span><a href={`tel:${settings.phone}`}>{settings.phone}</a></span>
                                                </p>
                                            </div>
                                        </div>
                                        <div className="col-lg-2 col-md-6 col-sm-12">
                                            <p className="footer_heading">Company</p>
                                            <ul>
                                                {(() => {
                                                    if (static_pages.length > 0) {
                                                        return (
                                                            static_pages.map((page, index) => {
                                                                return (
                                                                    <Link href={page.url} key={index} passHref>
                                                                        <li>
                                                                            <a className='link'>
                                                                                {page.title}
                                                                            </a>
                                                                        </li>
                                                                    </Link>
                                                                )
                                                            })
                                                        )
                                                    }
                                                })()}
                                            </ul>
                                        </div>
                                        <div className="col-lg-3 col-md-6 col-sm-12">
                                            <p className="footer_heading">Our Services</p>
                                            <ul>
                                                {(() => {
                                                    if (services !== null && services.length > 0) {
                                                        const divider_num = Math.ceil((services.length) / 2);
                                                        return (
                                                            services.map((item, i) => {
                                                                if ((item.display_type === 'both' || item.display_type === 'page') && i < divider_num) {
                                                                    return (
                                                                        <li key={i}>
                                                                            <Link href={`/${item.slug}`} passHref>
                                                                                <span className='link'>{item.title}</span>
                                                                            </Link>
                                                                        </li>
                                                                    )
                                                                }
                                                            })
                                                        )
                                                    }
                                                    return null;
                                                })()}
                                            </ul>
                                        </div>
                                        <div className="col-lg-3 col-md-6 col-sm-12">
                                            <p className="footer_heading" style={{ visibility: 'hidden' }}>Hidden Heading</p>

                                            <ul>
                                                {(() => {
                                                    if (services !== null && services.length > 0) {
                                                        const divider_num = Math.ceil((services.length) / 2);
                                                        return (
                                                            services.map((item, i) => {
                                                                if ((item.display_type === 'both' || item.display_type === 'page') && i >= divider_num) {
                                                                    return (
                                                                        <li key={i}>
                                                                            <Link href={`/${item.slug}`}>
                                                                                <span className='link'>{item.title}</span>
                                                                            </Link>
                                                                        </li>
                                                                    )
                                                                }
                                                            })
                                                        )
                                                    }
                                                    return null;
                                                })()}
                                            </ul>
                                        </div>
                                        <div className="col-lg-8 col-md-8 col-sm-12 mtop_3 text-white">
                                            {settings.copyright != "" && typeof settings.copyright !== 'undefined' ?
                                                <div className="post__content" dangerouslySetInnerHTML={{ __html: settings.copyright.replace("[YEAR]", new Date().getFullYear()) }}></div>
                                                : "Loading..."}
                                        </div>
                                        <div className="col-lg-4 col-md-4 col-sm-12 text-right mtop_3">
                                            <p>
                                                <Link href={'/terms-conditions'}>
                                                    <a className="link mr-2">
                                                        Terms and Conditions
                                                    </a>
                                                </Link>
                                                {/* <Link href={'/sitemap.xml'}>
                                                    <a className="link" target={'_blank'}>
                                                        Site Map
                                                    </a>
                                                </Link> */}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </footer>
                            <div className={styles.floating_wpp}>
                                <Link href={`https://api.whatsapp.com/send?phone=${whatsapp}&text=Hello%20OnePlace2Save!`}>
                                    <a target="_blank" className={styles.floating_wpp__floating_wpp_button}>
                                        <Image className={styles.floating_wpp__floating_wpp_button__img} src={'/images/whatsapp.svg'} alt="WhatsApp" height={60} width={60} layout='responsive' />
                                    </a>
                                </Link>
                            </div>
                        </>
                    )
                }
            })()}
        </>
    )
}
export default Footer