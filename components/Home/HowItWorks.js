import Image from 'next/image'

const HowItWorks = ({ how_it_works }) => {
    return (
        <>
            <section className="what_we_do animate__animated animate__slideInUp">
                <div className="container">
                    <p className="text-center title">How it works</p>
                    <div className="row">
                        {(() => {
                            if (how_it_works && how_it_works.length > 0) {
                                return (
                                    how_it_works.map((item, key) => {
                                        return (
                                            <div className="col-lg-4 col-md-4 col-sm-12" key={key}>
                                                <div className="yellow_box hvr-shutter-out-vertical">
                                                    <span className="font-weight-bold count"> {item.title} </span>
                                                    <img src={item.asset} width='150px' height='150px' alt={item.title} />
                                                    <span className="content">
                                                        <div className="" dangerouslySetInnerHTML={{ __html: item.content }}></div>
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
        </>
    )
}

export default HowItWorks
