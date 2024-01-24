import React, { Fragment, useState } from 'react'
import { random_str } from '../../services/helper'
import Image from 'next/image'

const Faq = ({ faq }) => {
    const [instaImg, setInstaImg] = useState([
        'https://i.ibb.co/5R7p5pq/244279953-581786252974725-5878086412796846365-n-webp.jpg',
        'https://i.ibb.co/vmCVgHt/op2s-insta-feeds-02.jpg',
        'https://i.ibb.co/tpvrVVL/op2s-insta-feeds-01.jpg',
        'https://i.ibb.co/6FF6yZq/op2s-insta-feeds-04.jpg',
        'https://i.ibb.co/LrZPBpB/op2s-insta-feeds-06.jpg',
        'https://i.ibb.co/J7JsTvF/op2s-insta-feeds-05.jpg'
    ])
    return (
        <>
            <section className="faq_section">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-7">
                            <p className="title">FAQ</p>
                            <div id="accordion" className="mtop_3">
                                {(() => {
                                    if (faq && faq.length > 0) {
                                        return (
                                            faq.map((item, key) => {
                                                let random = 'opts' + Math.random().toString(36).substr(2, 9)
                                                return (
                                                    <div className="accordion" key={key}>
                                                        <div className="accordion-header" id="headingTwo">
                                                            <h5 className="mb-0">
                                                                <a className="collapsed" data-toggle="collapse" data-target={`#${random}`}
                                                                    aria-expanded="false">
                                                                    {item.title} <br />
                                                                </a>
                                                            </h5>
                                                        </div>
                                                        <div id={`${random}`} className="collapse" aria-labelledby="headingTwo" data-parent="#accordion">
                                                            <div className="accordion-body">
                                                                <div className="post__content" dangerouslySetInnerHTML={{ __html: item.content }}></div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )
                                            })
                                        )
                                    }
                                })()}
                            </div>
                        </div>
                        <div className="col-lg-5">
                            <p className="title">Instagram</p>
                            <div className="row">
                                {instaImg.map((a, key) =>
                                    <div className="col-6" key={key}>
                                        <div className="insta_photo">
                                            <Image src={a} layout='responsive' height={'70%'} width={'100%'} />
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}

export default Faq
