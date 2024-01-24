import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'

const StorageAd = ({ storage_ad }) => {
    const router = useRouter()
    const [storageAd, setStorageAd] = useState({
        title: "",
        content: "",
        image: ""
    })
    useEffect(() => {
        if (storage_ad !== null && storage_ad.length > 0) {
            setStorageAd({
                title: storage_ad[0].title,
                content: storage_ad[0].content,
                image: storage_ad[0].asset
            })
        }
    }, [])
    return (
        <>
            <section className="storage_service"
                style={{background: `url('${storageAd.image}') no-repeat`}}
            >
                <div className="container">
                    <p className="heading"> {storageAd.title} </p>
                    <div className="post__content" dangerouslySetInnerHTML={{ __html: storageAd.content }}></div>
                    <button className="btn red_bg hvr-bounce-to-right" onClick={() => router.push('/storages')}>
                        Choose Your Storage Space
                        <i className="fa fa-chevron-right ml-3"></i>
                    </button>
                </div>
            </section>
        </>
    )
}

export default StorageAd
