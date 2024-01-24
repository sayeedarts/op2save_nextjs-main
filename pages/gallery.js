import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import axios from '../services/axios'


import DztImageGalleryComponent from "reactjs-image-gallery";
import NoRecordFound from '../components/Common/NoRecordFound';
import TopBanner from '../components/Common/TopBanner';

const Gallery = () => {
    const [photos, setPhotos] = useState([])

    useEffect(() => {
        getGallery()
        return () => {
            // cleanup
        }
    }, [])

    const getGallery = async () => {
        const initApi = await axios.get(`galleries`)
        const response = await initApi.data
        let GalleryImages = []
        if (response.status == 1) {
            const images = response.data
            images.map((image, index) => {
                GalleryImages.push({
                    url: image.asset,
                    title: image.title,
                    thumbUrl: image.asset
                })
            })
        }
        setPhotos(GalleryImages)
    }

    return (
        <>
            <TopBanner title={'Gallery'} />
            <section className="storage">
                <div className="container">
                    <div className='gallery'>
                        {photos.length > 0 ?
                            <DztImageGalleryComponent
                                images={photos}
                                imgClassName={'gallery_img'}
                                className='a b c' />
                            :
                            <NoRecordFound title={'No Gallery found'} />
                        }
                    </div>
                </div>
            </section>
        </>
    )
}

export default Gallery