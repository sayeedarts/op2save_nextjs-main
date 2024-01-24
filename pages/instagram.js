import React, { useState, useEffect } from 'react'

const Instagram = () => {


    const [photos, setPhotos] = useState([])

    useEffect(() => {
        fetchInsta()

    }, [])

    const fetchInsta = async () => {
        try {
            // Hack from https://stackoverflow.com/a/47243409/2217533
            const response = await fetch(
                `https://www.instagram.com/graphql/query?query_id=17888483320059182&variables={"id":"3468531814","first":60,"after":null}`
            );
            const { data } = await response.json();
            const photos = data.user.edge_owner_to_timeline_media.edges.map(
                ({ node }) => {
                    const { id } = node;
                    const caption = node.edge_media_to_caption.edges[0].node.text;
                    const thumbnail = node.thumbnail_resources.find(
                        thumbnail => thumbnail.config_width === 640
                    );
                    const { src, config_width: width, config_height: height } = thumbnail;
                    const url = `https://www.instagram.com/p/${node.shortcode}`;
                    return {
                        id,
                        caption,
                        src,
                        width,
                        height,
                        url
                    };
                }
            );
            // setPhotos({ photos });
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <>

        </>
    )
}

export default Instagram
