// Base URL
const api_baseurl = process.env.NEXT_PUBLIC_API_BASE_URL

const icons = {
    logo: '/assets/logo.png',
    loader: '/assets/icons/loader.gif',
    notfound: '/assets/error-404.png',
    man_with_packages: '/assets/vectors/man-with-packages.png',
    empty: '/assets/icons/icons8-empty-60.png',
    login: '/assets/vector-login.jpg',
    register: '/assets/vector-register.jpg',
    slick_next: '/assets/right-arrow.png',
    slick_prev: '/assets/left-arrow.png',
    contact_us: '/assets/vectors/male-female-comminicate.png',
    author_singgle: '/assets/Author_Singgle-01_generated.jpg',
    girl_using_laptop: '/assets/vectors/girl-using-laptop.png',
    truck_loader: '/assets/icons8-truck.gif',
    online_shopping_laptop: '/assets/vectors/online_shopping_laptop.png',
    how_it_works: [
        { image: '/assets/how-it-works1.png' },
        { image: '/assets/how-it-works2.png' },
        { image: '/assets/how-it-works3.png' },
    ],
    success_tick: '/assets/icons/tick.png',
    verified: '/assets/icons/verified.png',
}

const covers = {
    stoarge: '/assets/storage-cover-image.png',
    home_top_pattern: '/assets/pattern-bg.jpg',
    home_top_van: '/assets/van.png',
    cart_banner: '/assets/banners/cart.png',
    services_banner: '/assets/banners/services.png',
    contact_us_banner: '/assets/banners/contact-us.png',
    common_banner: '/assets/banners/banner-common.jpg',
    soarge_banner: '/assets/banners/storages.png',
    packing_material_banner: '/assets/banners/packing-materials.png',
    blogs_banner: '/assets/banners/blogs.png',
    gallery_banner: '/assets/banners/gallery.png',
    ad_storage_space: '/assets/banners/shop-storage.jpg',
    ad_packing_material: '/assets/banners/shop-packings.jpg',
}

const floors = {
    "ground-floor": "Ground Floor",
    "basement": "Basement",
    "1st-floor": "1st Flooor",
    "2nd-floor": "2nd Flooor",
    "3rd-floor": "3rd Flooor",
    "4th-floor": "4th Flooor",
    "5th-floor": "5th Flooor",
    "6th-floor": "6th Flooor",
    "above-6th-floor": "Above 6th Flooor",
}

/**
 * Live Payment Details
 */
const paypal = {
    currency: 'GBP',
    client_id: 'AXMUeILONfHXa5jeg3W7nTQ4J-_QQAhL1dQRybLE5hKhsPLa4k8M7Pg-ngcUFAZVWtPebcu3cg4HDDi5'
}

/**
 * Sandbox paypal Details
 */
// const paypal = {
//     currency: 'GBP',
//     client_id: 'AeCpU4Dgjemp8OTV-EG6DrEbdfXCCg71XWqY9MhyokNk11-Xb17mHj2WH8SioxNGZrrH2Wa1_kC2P0T9'
// }

const price_params = {
    currency: {
        symbol: "£",
        code: "GBP"
    },
    vat: 1.5//3.50
}

const location = {
    key: '35a4230eecd24ad790fbca46ab6e3064',
    type: 'street',
    country: 'gb',
    limit: 6
}
const ideal_postcodes = {
    endPoint: 'https://api.ideal-postcodes.co.uk/v1/',
    key: 'ak_kzlk31jhp05acnYAYUittaQtk2OQa'
}

const static_pages = [
    {
        title: 'About Us',
        url: '/about-us'
    },
    {
        title: 'Our Services',
        url: '/removal-services'
    },
    {
        title: 'Contact us',
        url: '/contact-us'
    },
    {
        title: 'Blog',
        url: '/blogs?page=1'
    },
    {
        title: 'Storage',
        url: '/storage-london'
    },
    {
        title: 'Gallery',
        url: '/gallery'
    },
    {
        title: 'Request a Quote',
        url: '/'
    }
]

export {
    // pickup_options,
    // additional_help,
    static_pages,
    api_baseurl,
    floors,
    icons,
    covers,
    price_params,
    location,
    ideal_postcodes,
    paypal
}