import { useState, useEffect } from 'react'
import '../styles/globals.css'
import Head from 'next/head'
import Router from "next/router"
import Script from 'next/script'

import axios from '../services/axios'
import Loading from '../components/Common/Loading'
import Header from '../components/Layouts/Header'
import Footer from '../components/Layouts/Footer'

// Redux
import { Provider } from 'react-redux'
import store from '../redux/store'

function MyApp({ Component, pageProps, title }) {
	const [loading, setLoading] = useState(false);
	const [settings, setSettings] = useState([]);
	const [brand, setBrand] = useState([]);
	const [services, setServices] = useState([]);

	useEffect(() => {
		// On Demand Request
		getMasterData()

		// System 
		const start = () => {
			console.log("Loading Started..");
			setLoading(true);
		};
		const end = () => {
			console.log("Loading Finished..");
			setLoading(false);
		};
		Router.events.on("routeChangeStart", start);
		Router.events.on("routeChangeComplete", end);
		Router.events.on("routeChangeError", end);
		return () => {
			Router.events.off("routeChangeStart", start);
			Router.events.off("routeChangeComplete", end);
			Router.events.off("routeChangeError", end);
		};
	}, []);

	// get master settings
	const getMasterData = async () => {
		const callApi = await axios.get('site-settings');
		const getData = await callApi.data;
		if (getData.status == 1) {
			setSettings(getData.data.settings[0])
			setBrand(getData.data.settings[0].brand);
			setServices(getData.data.services)
		}
	}

	return (
		<>
			<Head>
				<meta charSet='UTF-8' />
				<meta name="viewport" content="width=device-width, initial-scale=1.0" />
				{/* <title>Oneplace2save</title> */}
			</Head>

			{/* Scripts */}
			<Script src="https://code.jquery.com/jquery-3.5.1.slim.min.js" strategy='beforeInteractive' />
			<Script src="https://cdn.jsdelivr.net/npm/bootstrap@4.5.3/dist/js/bootstrap.bundle.min.js" strategy='beforeInteractive' />
			<Script
				id='dropdown-navigation'
				strategy="afterInteractive"
				dangerouslySetInnerHTML={{
					__html: `
					`,
				}}
			/>

			<Provider store={store}>
				{loading ? (
					<Loading />
				) : (
					<>
						<Header settings={settings} brand={brand} services={services} />
						<Component {...pageProps} loading={loading} />
						<Footer settings={settings} services={services} />
					</>
				)}
			</Provider>
		</>
	)
}

export default MyApp
