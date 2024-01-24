import React from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { format } from '../../services/helper'
import { price_params } from '../../services/data'

const Breadcrumb = ({ crumbs, cartStats, rightBlock }) => {
    const router = useRouter()
    return (
        <>
            <section id="breadcrumb">
                <div className="container">
                    <div className="row">
                        <div className="col-md-8">
                            <nav aria-label="breadcrumb">
                                <ol className="breadcrumb">
                                    <li className="breadcrumb-item"><a href="#">Home</a></li>
                                    {crumbs().map((c, k) =>
                                        <li key={k} className="breadcrumb-item active" aria-current="page"> {c.name} </li>
                                    )}

                                </ol>
                            </nav>
                        </div>
                        {rightBlock == true && cartStats ?
                            <div className="col-md-4">
                                <div className="cart_summary">
                                    <Link href={'/packing-material/cart'}>
                                        <a>
                                            <div className="cart_icon"><i className="fa fa-shopping-cart" aria-hidden="true"></i></div>
                                            <div className="summary">
                                                <h6 className="bc_title">Your trolley</h6>
                                                <p>
                                                    {cartStats.total_items > 0 ? cartStats.total_items : 0} Items, {price_params.currency.symbol}{cartStats.total > 0 ? format(cartStats.total) : 0}
                                                </p>
                                            </div>
                                        </a>
                                    </Link>
                                </div>
                            </div>
                            : ""}
                    </div>
                </div>
            </section>
        </>
    )
}

export default Breadcrumb
