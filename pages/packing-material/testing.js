import React, { useState, useEffect, useRef } from 'react'
import Head from 'next/head'
import Script from 'next/script'

function Product({ product }) {
    const [paidFor, setPaidFor] = useState(false);
    const [error, setError] = useState(null);
    const paypalRef = useRef();

    useEffect(() => {
        window.paypal
            .Buttons({
                createOrder: (data, actions) => {
                    return actions.order.create({
                        purchase_units: [
                            {
                                description: product.description,
                                amount: {
                                    currency_code: 'GBP',
                                    value: product.price,
                                },
                            },
                        ],
                    });
                },
                onApprove: async (data, actions) => {
                    const order = await actions.order.capture();
                    setPaidFor(true);
                },
                onError: err => {
                    setError(err);
                    console.error(err);
                },
            })
            .render(paypalRef.current);
    }, [product.description, product.price]);

    if (paidFor) {
        return (
            <div>
                <h1>Congrats, you just bought {product.name}!</h1>
                <img alt={product.description} src={gif} />
            </div>
        );
    }

    return (
        <div>
            <Head>
                <title>Packing Cart</title>
                <link rel="stylesheet" href="css/cart-list.css" />
            </Head>
            {/* Paypal Script */}
            <Script
                src="https://www.paypal.com/sdk/js?client-id=AeCpU4Dgjemp8OTV-EG6DrEbdfXCCg71XWqY9MhyokNk11-Xb17mHj2WH8SioxNGZrrH2Wa1_kC2P0T9&currency=GBP" strategy='beforeInteractive'
                onLoad={() => {
                    console.log("Paypal Loads");
                }} />
            {error && <div>Uh oh, an error occurred! {error.message}</div>}
            <h1>
                {product.description} for ${product.price}
            </h1>
            <img alt={product.description} src={product.image} width="200" />
            <div ref={paypalRef} />
        </div>
    );
}

function Testing() {
    const product = {
        price: 777.77,
        name: 'comfy chair',
        description: 'fancy chair, like new',
    };

    return (
        <div className="App">
            <Product product={product} />
        </div>
    );
}

export default Testing;
