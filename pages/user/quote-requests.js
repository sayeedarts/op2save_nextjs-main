import React, { useState, useEffect } from 'react'
// Next
import { useRouter } from 'next/router'
import Head from 'next/head'
import Link from 'next/link'

import { check_login, clear_user_data, user_data } from '../../services/helper'
import { api_baseurl } from '../../services/data'
import axios from '../../services/axios';
import UserBlock from '../../components/User/UserBlock';
import Breadcrumb from '../../components/User/Breadcrumb';
import DataTable from 'react-data-table-component';

const QuoteRequests = () => {
    const pageTitle = "User Quote Requests"
    const [quotes, setQuotes] = useState([]);
    const router = useRouter();
    useEffect(() => {
        if (check_login() == 0) router.push('/auth/login')
        // Get User data from API
        getOrders()
    }, [])

    const getOrders = async () => {
        const initApi = await axios.post('quote/requests', {
            email: user_data('email'),
        })
        const getResponse = await initApi.data;
        setQuotes(getResponse.data);
    }

    const columns = [
        {
            name: 'Source',
            wrap: true,
            selector: row => row.location.from,
            sortable: true,
        },
        {
            name: 'Destination',
            wrap: true,
            selector: row => row.location.to,
            sortable: true,
        },
        {
            name: 'Date',
            grow: '0',
            selector: row => row.quote_date,
            sortable: true,
        },
        {
            name: 'Pickup',
            wrap: true,
            grow: '0',
            selector: row => {
                return (
                    <>
                        {row.pickup_details.mode} <br />
                        {row.pickup_details.date}
                    </>
                )
            },
            sortable: true,
        },
        {
            name: 'Action',
            grow: 'no',
            selector: row => {
                return (
                    <>
                        <Link href={`${api_baseurl}/service/${row.id}/quote-generate?mode=stream`}>
                            <a className="btn btn-sm" target={'_blank'}> <i className="fa fa-eye"></i> </a>
                        </Link>
                    </>
                )
            },
            sortable: true,
        },
    ];
    const data = quotes

    return (
        <>
            <Head>
                <title> {pageTitle} </title>
                <link rel="stylesheet" href="/css/user-profile.css" />
            </Head>
            <section id="user-profile">
                <div className="container mb-4">
                    <Breadcrumb activeMenu={'quote-requests'} title={pageTitle} />
                </div>
                <div className='container'>
                    <div className="row gutters-sm">
                        <UserBlock activeMenu={'storage-orders'} />
                        <div className="col-md-9">
                            <div className="card mb-3">
                                <div className="card-body">
                                    <DataTable
                                        title={pageTitle}
                                        columns={columns}
                                        data={data}
                                        pagination
                                        striped={true}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}

export default QuoteRequests
