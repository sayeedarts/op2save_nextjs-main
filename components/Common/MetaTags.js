import React from 'react'
// import { useRouter } from 'next/router'

const MetaTags = ({ title, description, keywords, url, image }) => {
    // const defImage = `${process.env.NEXT_PUBLIC_APP_URL}images/seo/home-group-photo.jpg`
    const twoImage = `${process.env.NEXT_PUBLIC_APP_URL}images/seo/Two.jpg`

    return (
        <>
            {/* Primary Meta Tags */}
            <title>{title}</title>
            <meta name="title" content={title} />
            <meta name="description" content={description} />
            
            {/* Other Meta Data */}
            {/* Keywords */}
            <meta name="keywords" content={keywords} />
            <meta name="robots" content="index, follow" />
            <link rel="canonical" href={process.env.NEXT_PUBLIC_APP_URL} />
            <meta httpEquiv='Content-Type' content="text/html; charset=utf-8" />
            <meta name="language" content="English" />
            <meta name="revisit-after" content="7 days" />

            {/* Open Graph / Facebook */}
            <meta property="og:type" content="website" />
            <meta property="og:url" content={`${process.env.NEXT_PUBLIC_APP_URL}${url}`} />
            <meta property="og:site_name" content={process.env.NEXT_PUBLIC_APP_NAME} />
            <meta property="og:title" content={title} />
            <meta property="og:description" content={description} />
            <meta property="og:image" content={!image ? twoImage : image} />

            {/* Twitter */}
            <meta property="twitter:card" content="summary_large_image" />
            <meta property="twitter:url" content={process.env.NEXT_PUBLIC_APP_URL} />
            <meta name="twitter:site" content="@oneplace2save" />
            <meta property="twitter:title" content={title} />
            <meta property="twitter:description" content={description} />
            <meta property="twitter:image" content={!image ? twoImage : image} />
        </>
    )
}
export default MetaTags