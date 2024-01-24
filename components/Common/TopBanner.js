// import { useRouter } from 'next/router';
// import { covers } from '../../services/data'

const TopBanner = ({ title, banner }) => {
    // const router = useRouter()
    // const fetchPath = router.asPath
    // const currentRoute = fetchPath.replace(/[^a-zA-Z- ]/g, "")
    const bannerTag = typeof banner !== 'undefined' ? banner : 'common';
    const bannerImg = `/assets/banners/banner-${bannerTag}.jpg`;
    return (
        <>
            <section className="inner-banner animate__animated-x animate__slideInUp-x">
                <div className="bg">
                    <img src={bannerImg} alt="Snow" className='img-fluid' />
                    <div className="heading centered text-center"> {title} </div>
                </div>
            </section>
        </>
    )
}

export default TopBanner
