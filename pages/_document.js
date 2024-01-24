import Document, { Html, Head, Main, NextScript } from 'next/document'
import Footer from '../components/Layouts/Footer'
import Header from '../components/Layouts/Header'



class MyDocument extends Document {
    static async getInitialProps(ctx) {
        const initialProps = await Document.getInitialProps(ctx)
        return { ...initialProps }
    }

    render() {
        return (
            <Html lang='en'>
                <Head>
                    <link type="image/x-icon" rel="shortcut icon" href="/assets/favicon.png" />
                    <link rel="stylesheet" href="/css/bootstrap.min.css" />
                    <link rel="stylesheet" href="/css/font-awesome.css" />
                    <link rel="stylesheet" href="/css/hover-min.css" />
                    <link rel="stylesheet" href="/css/animate.min.css" />
                    <link rel="stylesheet" href="/css/common.css" />
                    <link rel="stylesheet" href="/css/index.css" />
                    <link rel="stylesheet" href="/css/tanmaya.css" />
                </Head>
                <body>
                    <Main />
                    <NextScript />
                </body>
            </Html>
        )
    }
}

export default MyDocument
