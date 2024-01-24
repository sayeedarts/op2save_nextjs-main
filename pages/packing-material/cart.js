import React, { useState, useEffect, Fragment } from 'react'
// nextjs Extns
import Head from 'next/head'
import Script from 'next/script'
import { useRouter } from 'next/router'
import Link from 'next/link'

import ReactDOM from 'react-dom'
import * as Scroll from 'react-scroll';
// import styles from './CartList.module.css'
import { check_login, encrypt, user_data, format, cart_total, load_to_top as LTT } from '../../services/helper'
import { price_params, paypal } from '../../services/data'
import axios from '../../services/axios'
// Manage State
import { useSelector, useDispatch } from 'react-redux'
import { updateCart, emptyCart } from '../../redux/CartSlice';
import NoRecordFound from '../../components/Common/NoRecordFound'
import Breadcrumb from '../../components/Common/Breadcrumb'
import RequestComplete from '../../components/Common/RequestComplete';
import TopBanner from '../../components/Common/TopBanner'
import Loading from '../../components/Common/Loading'

if (typeof window !== "undefined") {
    if (typeof window.paypal !== "undefined") {
        if (typeof window.paypal.Buttons !== "undefined") {
            const PayPalButton = window.paypal.Buttons.driver("react", { React, ReactDOM });
        }
    }
}

const PackingCart = () => {
    const router = useRouter()
    // State
    const dispatch = useDispatch();
    const cart_details = useSelector((state) => state.CartSlice);
    const settings = useSelector((state) => state.homeSlice.settings);

    var scroll = Scroll.animateScroll;

    let [loading, setLoading] = useState(false)
    let [cart, setCart] = useState(cart_details.products)
    const [cartStats, setCartStats] = useState([]);
    const [showPaypal, setShowPaypal] = useState(0)
    const [price, setPrice] = useState({
        subtotal: 0,
        total: 11
    })
    const [payment, setPayment] = useState({
        total: 0,
        currency: 'GBP',
    });

    const crumbs = () => {
        return [
            { name: "Item Packaging", path: "", hasRedirect: false },
        ]
    }

    const [vat, setvat] = useState(0)
    useEffect(() => {
        if (check_login() == 0) {
            router.push('/auth/login')
        } else {
            setvat(parseFloat(settings.vat))
            // Calculate total
            total()
            userAddress()
            const cart_stats = cart_total(cart_details.products, vat);
            setCartStats(cart_stats)
        }
        // LTT()
        return () => {
            // cleanup
        }
    }, [cart, vat])

    const [address, setAddress] = useState({});
    const userAddress = async () => {
        // user/address/get
        const initApi = await axios.post('/user/address/get', { email: user_data('email') })
        const getResponse = await initApi.data;
        if (getResponse.status == 1) {
            setAddress(getResponse.data)
        }
    }

    const handleQuantityChange = (event, id) => {
        let qty = event.target.value
    }

    const total = () => {
        let totalAmount = 0;
        let subtotal = 0;
        if (cart && cart.length > 0) {
            cart.map((item, key) => {
                subtotal += parseFloat(item.subtotal)
            })
            let vatPrice = format(subtotal * (vat / 100))
            totalAmount = parseFloat(subtotal) + parseFloat(vatPrice)
        }
        setPrice({
            subtotal: subtotal,
            vat: vatPrice,
            total: totalAmount,
            currency: price_params.currency.code
        })
    }

    /**
     * Increase the Product's Quantity on ckicking on the Plus icon
     * @param {*} productId 
     * @param {*} mode 
     */
    const toggleQuantityChange = (productId, mode) => {
        setShowPaypal(0)
        let cartItems = []
        cart.map((item, key) => {
            let newItem = { ...item }
            if (item.id == productId) {
                let newPrice, newQuantity = 0;
                if (mode == "asc") {
                    newQuantity = newItem.quantity + 1
                    newPrice = parseFloat(newQuantity * newItem.price).toFixed(2)
                } else if (mode == "desc") {
                    newQuantity = newItem.quantity > 1 ? newItem.quantity - 1 : 1
                    newPrice = parseFloat(newQuantity * newItem.price).toFixed(2)
                }
                newItem.quantity = newQuantity
                newItem.subtotal = newPrice
            }
            cartItems.push(newItem)
        })
        setCart(cartItems)
        // Update in the cart
        dispatch(updateCart({
            products: cartItems
        }))
        total()
    }

    /**
     * Remove a Product from the cart list
     * @param {*} e 
     * @param {*} productId 
     */
    const removeItemFromcart = (e, productId) => {
        e.preventDefault()
        setShowPaypal(0)
        if (window.confirm("Are your sure to remove this item from cart!") == true) {
            let cartItems = [...cart]
            var index = cartItems.findIndex(p => p.id == productId);
            cartItems.splice(index, 1)
            // setCart(cartItems)

            // Update in the cart
            dispatch(updateCart({
                products: cartItems
            }))
            setCart(cartItems)
            total()
        }
    }

    const handleClickProceed = (e) => {
        e.preventDefault()
        setShowPaypal(1)

        if (check_login() == 0) router.push('/auth/login')

        const cart_stats = cart_total(cart_details.products);
        setPayment({
            total: cart_stats.total,
            currency: price_params.currency.code,
        })
    }

    /**
     * Paypal Integration Starts
     */
    const createOrder = (data, actions) => {
        const purchaseUnit = [
            {
                description: "Packing Items Purchase",
                amount: {
                    currency_code: price.currency,
                    value: price.total,
                },
            },
        ];
        return actions.order.create({
            intent: "CAPTURE",
            purchase_units: purchaseUnit,
        });
    }

    const onApprove = async (data, actions) => {
        const capture = await actions.order.capture();
        // setPurchaseInfo(capture);
        afterPurchase(data);
    }

    function onError(err) {
        // const requestParam = {
        //     gateway_response: purchaseInfo,
        //     user_id: 1,
        // }
    }

    /**
     * What to do After purchase done
     */
    const [processStatus, setProcessStatus] = useState({
        status: 0,
        heading: "",
        message: 'pending'
    });
    const afterPurchase = async (payload) => {
        setLoading(true)
        const request_payload = encrypt(JSON.stringify({
            paymentResponse: payload,
            user: user_data('email'),
            cart: cart,
            price: price
        }));
        const initApi = await axios.post('/packaging/payment', { data: request_payload })
        const getResponse = await initApi.data;
        if (getResponse.status == 1) {
            dispatch(emptyCart())
            setCart([])
            // After getting response
            setProcessStatus({
                status: 1,
                heading: "Your Payment was successful",
                message: "We have received your payment. You can print your invoice from your profile section",
                redirectTo: '/user/profile',
                redirectText: 'Go to Dashboard'
            })

        } else {
            setProcessStatus({
                status: 0,
                heading: "Your Payment was failed",
                message: "Due to some problem we could not process your payment. Please try again later.",
                redirectTo: '/user/profile',
                redirectText: 'Go to Dashboard'
            })
        }
        // Stop Loading
        setLoading(false)
    }

    return (
        <>
            <Head>
                <title>Packing Cart</title>
                <link rel="stylesheet" href="/css/cart-list.css" />
            </Head>
            {/* Paypal Script */}
            <Script
                src={`https://www.paypal.com/sdk/js?client-id=${paypal.client_id}&currency=${paypal.currency}`}
                strategy='beforeInteractive'
                onLoad={() => {
                    console.log("Paypal Loads");
                }} />

            {/* Header Section */}
            {(() => {
                if (processStatus.status === 0) {
                    return (
                        <TopBanner title={'Your Cart'} banner='packing' />
                    )
                }
            })()}

            {/* <!-- Breadcrumb start --> */}
            <Breadcrumb crumbs={crumbs} cartStats={cartStats} rightBlock={true} history={router} />
            {/* <!-- Breadcrumb end --> */}
            {(() => {
                if (loading === true) {
                    return (
                        <Loading title={'Processing your Payment, please wait.'} />
                    )
                } else if (processStatus.status == 1 && processStatus.status) {
                    return (
                        <section className="cart animate__animated animate__slideInUp p-0">
                            <div className="container my-4">
                                <RequestComplete quoteStatus={processStatus} />
                            </div>
                        </section>
                    )
                } else {
                    return (
                        <section className="cart animate__animated animate__slideInUp">
                            <div className="container">
                                {cart && cart.length > 0 ?
                                    <Fragment>
                                        <div className="table-responsive">
                                            <table className="table table-striped">
                                                <thead>
                                                    <tr>
                                                        <th scope="col" width="100">Item</th>
                                                        <th scope="col"></th>
                                                        <th scope="col">Price</th>
                                                        <th scope="col">Qty</th>
                                                        <th scope="col">Sub Total</th>
                                                        <th scope="col"></th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {(() => {
                                                        if (cart && cart.length > 0) {
                                                            return (
                                                                cart.map((item, key) => {
                                                                    return (
                                                                        <tr key={key}>
                                                                            <td>
                                                                                {/* {JSON.stringify(item.image)} */}
                                                                                <img width="100" className="card-img-top product_img" src={item.image} alt="Card image cap" />
                                                                            </td>
                                                                            <td align="left">
                                                                                {item.name}
                                                                            </td>
                                                                            <td>
                                                                                £{item.price}
                                                                            </td>
                                                                            <td>
                                                                                {/* Plus Minus Toggle */}
                                                                                <div className="quantity">
                                                                                    <div className="input-group">
                                                                                        <div className="input-group-prepend">
                                                                                            <span className="input-group-text link text-success" onClick={() => toggleQuantityChange(item.id, 'asc')}>
                                                                                                <i className="fa fa-plus"></i>
                                                                                            </span>
                                                                                        </div>
                                                                                        <input type="text" className="number_input form-control" aria-label="Amount (to the nearest dollar)" maxLength="3" value={item.quantity} onChange={(event) => handleQuantityChange(event, item.id)} />
                                                                                        <div className="input-group-append">
                                                                                            <span className="input-group-text link text-danger" onClick={() => toggleQuantityChange(item.id, 'desc')}>
                                                                                                <i className="fa fa-minus"></i>
                                                                                            </span>
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                            </td>
                                                                            <td>£{item.subtotal} </td>
                                                                            <td align="right">
                                                                                <a href="#" onClick={(e) => removeItemFromcart(e, item.id)}><i className="fa fa-trash" aria-hidden="true"></i></a>
                                                                            </td>
                                                                        </tr>
                                                                    )
                                                                })
                                                            )
                                                        }
                                                    })()}
                                                </tbody>
                                            </table>
                                        </div>
                                        <div className="row">
                                            <div className="col-md-8 justify-content-end-">
                                                {/* Billing Address section */}
                                                {address && Object.keys(address).length > 0 ?
                                                    <div className='row'>
                                                        <div className='col-6'>
                                                            <ul className="list-group">
                                                                <li className="list-group-item justify-content-between align-items-center p-3">
                                                                    <h4>Billing Address</h4>
                                                                    <div><strong>Fullname:</strong> {address.fullname}</div>
                                                                    <div><strong>Address:</strong> {address.address}</div>
                                                                    <div><strong>City:</strong> {address.city}</div>
                                                                    <div><strong>Country:</strong> United Kingdom</div>
                                                                    <div><strong>PostCode:</strong> {address.postcode}</div>
                                                                    <div><strong>Email address:</strong> {address.email}</div>
                                                                    <div><strong>Mobile:</strong> {address.mobile}</div>
                                                                    <Link href={'/user/address'}>
                                                                        <a>
                                                                            <span className="badge badge-primary badge-pill link">Click to Update Address</span>
                                                                        </a>
                                                                    </Link>
                                                                </li>
                                                            </ul>
                                                        </div>
                                                        <div className='col-6'>
                                                            <ul className="list-group">
                                                                <li className="list-group-item justify-content-between align-items-center p-3">
                                                                    <h4>Shipping Address</h4>
                                                                    <div><strong>Fullname:</strong> {address.shipping_fullname}</div>
                                                                    <div><strong>Address:</strong> {address.shipping_address}</div>
                                                                    <div><strong>City:</strong> {address.shipping_city}</div>
                                                                    <div><strong>Country:</strong> United Kingdom</div>
                                                                    <div><strong>PostCode:</strong> {address.shipping_postcode}</div>
                                                                    <div><strong>Email address:</strong> {address.shipping_email}</div>
                                                                    <div><strong>Mobile:</strong> {address.shipping_mobile}</div>
                                                                    <Link href={'/user/address'}>
                                                                        <a>
                                                                            <span className="badge badge-primary badge-pill link">Click to Update Address</span>
                                                                        </a>
                                                                    </Link>
                                                                </li>
                                                            </ul>
                                                        </div>

                                                    </div>
                                                    :
                                                    <Fragment>
                                                        <div className='alert alert-warning'>
                                                            We do not find any address of yours.
                                                            <Link href={'/user/address'}>
                                                                <a>
                                                                    <span className="badge badge-primary badge-pill link">
                                                                        Click to Add an Address
                                                                    </span>
                                                                </a>
                                                            </Link>
                                                        </div>
                                                    </Fragment>
                                                }
                                            </div>
                                            <div className="col-md-4 justify-content-end">
                                                {/* Total Price Summary Section */}
                                                <div>
                                                    <p style={{ textAlign: 'right' }} className="pull-right">
                                                        Net: <strong> {price_params.currency.symbol}{format(price.subtotal)}</strong> <br /><br />
                                                        VAT: <strong> {price_params.currency.symbol}{cartStats.vat} </strong> <br /><br />
                                                        Total: <strong> {price_params.currency.symbol}{format(price.total)} </strong><br /><br />
                                                    </p>
                                                    <div className="clearfix"></div>
                                                </div>
                                            </div>
                                        </div>
                                    </Fragment>
                                    : <NoRecordFound title="Cart is Empty" />
                                }
                                <div className="row">
                                    <div className="col-12 mt-3">
                                        <a href="#" onClick={(e) => { e.preventDefault(); router.push('/packing-material') }} className="btn btn-md reset_btn hvr-bounce-to-right pull-left">
                                            <i className="fa fa-chevron-circle-left" aria-hidden="true"></i> Continue Shopping
                                        </a>
                                    </div>
                                    <div className="col-md-9 col-sm-12 col-xs-12">
                                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                    </div>
                                    {cart && cart.length > 0 ?
                                        <div className="col-md-3 col-sm-12 col-xs-12">
                                            {(() => {
                                                if (showPaypal === 1 && typeof window !== "undefined") {
                                                    if (typeof window.paypal !== "undefined") {
                                                        if (typeof window.paypal.Buttons !== "undefined") {
                                                            const PayPalButton = window.paypal.Buttons.driver("react", { React, ReactDOM });
                                                            return (
                                                                <PayPalButton
                                                                    createOrder={(data, actions) => createOrder(data, actions)}
                                                                    onApprove={(data, actions) => onApprove(data, actions)}
                                                                    onCancel={() => onError("Canceled")}
                                                                    onError={(err) => onError(err)}
                                                                />
                                                            )
                                                        }
                                                    }
                                                }
                                                if (address && Object.keys(address).length > 0) {
                                                    return (
                                                        <a href="#" onClick={handleClickProceed} className="btn btn-lg instant_btn hvr-bounce-to-right pull-right">
                                                            <i className="fa fa-shopping-cart" aria-hidden="true"></i> Proceed to Payment
                                                        </a>
                                                    )
                                                }
                                            })()}
                                        </div>
                                        : ""}
                                </div>
                            </div>
                        </section>
                    )
                }
            })()}
        </>
    )
}

export default PackingCart