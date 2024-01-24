import configs from './configs'
import { price_params, ideal_postcodes } from '../services/data'
import Axios from '../services/axios'
import * as Scroll from 'react-scroll';
import sha256 from 'crypto-js/sha256';

const to_readable_date = (date) => {
    return new Date(date).toISOString().slice(0, 10)
}

/**
 * Define Common configs for the App
 */
const config = {
    GOOGLE_API_KEY: 'AIzaSyDM0TLNFMCOIzzy-6AzVC3zjRY9ZxhRzmQ',
    TEST: 'Tanmaya'
}

// Set data in Local storage
const set_storage = (key, value) => {
    localStorage.setItem(key, value);
}

// Get data from Local storage
const get_storage = (key) => {
    if (typeof window !== "undefined") {
        if (localStorage.getItem(key)) {
            return localStorage.getItem(key);
        }
    }
    return ""
}

// Remove data from Local storage
const delete_storage = (key) => {
    localStorage.removeItem(key);
}
/**
 * #########################################################################
 * User and Token Related helper methods
 * #########################################################################
 */
/**
 * Generate UUID from Javascript
 * @returns string
 */
const uuid = () => {
    var SHA256 = require("crypto-js/sha256");
    let uuid = SHA256(random_str(10))

    return uuid
}

const random_str = (length) => {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

/**
 * Get or Set User's or Visitor's UUID in Storage
 * @returns string
 */
const user_uuid = () => {
    const get_user_uuid = localStorage.getItem('user_uuid');
    if (!get_user_uuid) {
        const create_user_uuid = ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
            (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
        );
        localStorage.setItem('user_uuid', create_user_uuid);
    } else {
        return localStorage.getItem('user_uuid')
    }
}

const check_login = () => {
    const is_logged = get_storage('is_logged')
    const token = get_storage('token')
    if (is_logged == 1 && typeof token != 'undefined') {
        return 1
    }
    return 0

}

const token = () => {
    return get_storage('token')
}

/**
 * Get User Data
 * @param {*} key 
 * @returns 
 */
const user_data = (key = null) => {
    let user = [{
        name: "",
        email: "",
        mobile: ""
    }];
    if (get_storage('user')) {
        user = JSON.parse(get_storage('user'))
        if (key == null) {
            return user
        } else if (key) {
            return user[key];
        }
    }
    return user
}

const clear_user_data = () => {
    localStorage.clear();
    // delete_storage('is_logged')
    // delete_storage('token')
}

/**
 * #########################################################################
 * Security Related helper methods
 * #########################################################################
 */

/**
 * Encrypt a String using Crypto AES
 * @param {*} string 
 * @returns 
 */
const encrypt = (string) => {
    var CryptoJS = require("crypto-js");
    if (string) {
        return CryptoJS.AES.encrypt(string, configs.CRYPTO_SECRET_KEY).toString();
    }
}

/**
 * Decrypt a String using Crypto AES
 * @param {*} string 
 * @returns 
 */
const decrypt = (ciphertext) => {
    var CryptoJS = require("crypto-js");
    var bytes = CryptoJS.AES.decrypt(ciphertext, configs.CRYPTO_SECRET_KEY);
    return bytes.toString(CryptoJS.enc.Utf8);
}

/**
 * #########################################################################
 * Common general helper methods
 * #########################################################################
 */

const format = (number) => {
    return number.toFixed(2)
}

/**
 * Manupulate Date Formats
 * @param {*} date 
 * @param {*} format 
 * @returns 
 */
const date_format = (date, format) => {
    var options = !format ? { year: 'numeric', month: 'short', day: 'numeric' } : format;
    var getDate = new Date(date);
    var converted = getDate.toLocaleDateString("en-US", options)
    return converted
}

const locations = async (search, type = 'postcode') => {
    var requestOptions = {
        method: 'GET',
    };
    const initApi = await fetch(
        `${ideal_postcodes.endPoint}autocomplete/addresses?query=${search}&api_key=${ideal_postcodes.key}`,
        requestOptions
    );
    return initApi;
}

const postcode_info = async (udprn) => {
    var requestOptions = {
        method: 'GET',
    };
    const initApi = await fetch(
        `${ideal_postcodes.endPoint}udprn/${udprn}?api_key=${ideal_postcodes.key}`,
        requestOptions
    );
    const toJson = await initApi.json()
    const response = await toJson.result
    return {
        full: response.line_1 + ', ' + response.post_town + ', ' + response.postcode,
        line_1: response.line_1,
        line_2: response.line_2,
        post_town: response.post_town,
        postcode: response.postcode
    };
}

const countries = async () => {
    const initApi = await Axios.get('countries')
    const response = await initApi.data
    if (response.status == 1) {
        return response.data
    }
    return []
}

const cities = async (country) => {
    const initApi = await Axios.get(`cities?country=${country}`)
    const response = await initApi.data
    if (response.status == 1) {
        return response.data
    }
    return []
}

const date_diff = (start, end) => {
    const startDate = new Date(start);
    const endDate = new Date(end);
    const diffTime = Math.abs(endDate - startDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return (diffDays + 1)
}

const week_diff = (start, end) => {
    const startDate = new Date(start);
    const endDate = new Date(end);
    const diffTime = Math.abs(endDate - startDate);
    const weekDiff = Math.ceil(diffTime / (1000 * 60 * 60 * 24 * 7));
    return (weekDiff)
}

const trim_text = (string, n) => {
    return (string.length > n) ? string.substr(0, n - 1) + ' ... ' : string;
}

const debug = (data) => {
    console.log(
        JSON.stringify(data, null, " ")
    );
}

/**
 * When Page open on click on menu, it scrolls up to top of the page
 */
const load_to_top = () => {
    if (get_storage('to_scroll') == 1) {
        Scroll.animateScroll.scrollToTop();
        set_storage('to_scroll', 0)
    }
}

/**
 * Get cart details
 * @param {*} cart 
 * @returns 
 */
const cart_total = (cart, vat = price_params.vat) => {
    let totalAmount = 0;
    let subtotal = 0;
    if (cart && cart.length > 0) {
        cart.map((item) => {
            subtotal += parseFloat(item.subtotal)
        })
        let vatPrice = format(subtotal * (vat / 100))
        totalAmount = parseFloat(subtotal) + parseFloat(vatPrice)
    }
    return {
        total_items: cart.length,
        subtotal: subtotal,
        vat: vatPrice,
        total: totalAmount
    }
}

export default config;
export {
    uuid,
    random_str,
    format,
    user_uuid,
    set_storage,
    get_storage,
    delete_storage,
    encrypt,
    decrypt,
    check_login,
    user_data,
    token,
    clear_user_data,
    date_diff, week_diff,
    to_readable_date,
    trim_text,
    debug,
    cart_total,
    countries, cities,
    load_to_top,
    date_format,
    locations, postcode_info
}