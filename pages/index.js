import Head from 'next/head';
import Script from 'next/script';


import QueryForm from '../components/Home/QueryForm'
import axios from '../services/axios'
import Services from '../components/Home/Services'
import WhoWeAre from '../components/Home/WhoWeAre'
import StorageAd from '../components/Home/StorageAd'
import HowItWorks from '../components/Home/HowItWorks'
import Testimonials from '../components/Home/Testimonials'
import Faq from '../components/Home/Faq'
import { ModalContact } from '../components/Home/ModalContact'
import MetaTags from '../components/Common/MetaTags'
import { type } from 'os';

export default function Home({ services, siteData }) {
	console.log(siteData.settings.metadata);
	return (
		<>
			<Head>
				<title> {typeof siteData.settings.metadata.title !== 'undefined' ? siteData.settings.metadata.title : "Home: Oneplace2save"} </title>
                <MetaTags
                    title={siteData.settings.metadata.title}
                    description={siteData.settings.metadata.description}
                    keywords={siteData.settings.metadata.keywords}
                    url={''}
                    image={`${siteData.settings.metadata.image}`} />
				<link rel="stylesheet" href="/css/home_page.css" />
			</Head>

			{/* Quote Form */}
			<QueryForm services={services} />
			{/* Who We Are */}
			<WhoWeAre />

			{/* What we do: Services */}
			<Services services={services} />

			{/* Storage Ad Section */}
			<StorageAd storage_ad={siteData.storage_dvc_home_ad} />

			{/* How it Works */}
			<HowItWorks how_it_works={siteData.how_it_works} />

			{/* Testimonials */}
			<Testimonials testimonials={siteData.testimonials} />

			{/* FAQ */}
			<Faq faq={siteData.faq} />

			{/* <ModalContact /> */}
		</>
	)
}

// Server Side Fetching
export async function getServerSideProps() {
	const services = await serviceData();
	const siteData = await masterData();
	return {
		props: {
			services: services,
			siteData: siteData
		},
	}
}

const serviceData = async () => {
	const callApi = await axios.get('service/all');
	const services = await callApi.data.data;
	if (services.length > 0) {
		return services
	}
}

const masterData = async () => {
	const initApi = await axios.get('/home/masters')
	const getData = await initApi.data
	if (getData.status == 1) {
		return getData.data
	}
}