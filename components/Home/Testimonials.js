import Image from 'next/image'

const Testimonials = ({ testimonials = [] }) => {
    return (
        <>
            <section className="testimonial_slider corousel_section animate__animated animate__slideInUp">
                <div className="container">
                    <p className="text-center title">What Clients Say</p>
                    <div id="carouselExampleIndicators" className="carousel slide" data-ride="carousel">
                        <ol className="carousel-indicators">
                            {(() => {
                                if (testimonials && testimonials.length > 0) {
                                    return (
                                        testimonials.map((item, key) => {
                                            return (
                                                <li data-target="#carouselExampleIndicators" data-slide-to={key} key={key} className={key == 0 ? 'active' : ''}></li>
                                            )
                                        })
                                    )
                                }
                            })()}
                        </ol>
                        <div className="carousel-inner">
                            {(() => {
                                if (testimonials && testimonials.length > 0) {
                                    return (
                                        testimonials.map((item, key) => {
                                            return (
                                                <div className={'carousel-item ' + (key == 0 ? 'active' : '')} key={key}>
                                                    <p className="comment"> {item.title} </p>
                                                    <div className="cutomer">
                                                        {/* <img src={item.asset} /> */}
                                                        <Image src={item.asset} width={77} height={77} layout='fixed' priority='lazy' placeholder='empty' alt={item.title} />
                                                        <div dangerouslySetInnerHTML={{ __html: item.content }}></div>
                                                    </div>
                                                </div>
                                            )
                                        })
                                    )
                                }
                            })()}
                        </div>
                        <a className="carousel-control-prev" href="#carouselExampleIndicators" role="button" data-slide="prev">
                            <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                            <span className="sr-only">Previous</span>
                        </a>
                        <a className="carousel-control-next" href="#carouselExampleIndicators" role="button" data-slide="next">
                            <span className="carousel-control-next-icon" aria-hidden="true"></span>
                            <span className="sr-only">Next</span>
                        </a>
                    </div>
                </div>
            </section>
        </>
    )
}

export default Testimonials
