import React, { useState, useEffect } from 'react'
// NextJs
import { useRouter } from 'next/router'
import Head from 'next/head'
import { check_login, encrypt, clear_user_data, user_data } from '../../../services/helper'
import { api_baseurl } from '../../../services/data'
import axios from '../../../services/axios';
import Breadcrumb from '../../../components/User/Breadcrumb';
import UserBlock from '../../../components/User/UserBlock';
import PackageOrderModal from '../../../components/User/PackageOrderModal';
import NoRecordFound from '../../../components/Common/NoRecordFound';
import DataTable from 'react-data-table-component';

const PackageOrders = () => {
    const pageTitle = "Packing Orders"
    const [orders, setOrders] = useState([]);
    const router = useRouter()
    useEffect(() => {
        if (check_login() == 0) {
            router.push('/auth/login')
        } else {
            // Get User data from API
            getOrders()
        }
    }, [])

    const getOrders = async () => {
        const initApi = await axios.post('orders', {
            email: user_data('email'),
            module: "packing",
        })
        const getResponse = await initApi.data;
        setOrders(getResponse.data);
    }

    /**
     * Open Invoice
     * @param {*} id 
     */
    const handleInvoiceClick = (id) => {
        window.open(`${api_baseurl}/invoice/${id}/generate`, '_blank');
    }

    const columns = [
        {
            name: 'Order Number',
            selector: row => row.order_number,
            sortable: false,
        },
        {
            name: 'Item Deails',
            selector: row => row.module === 'packing' ? 'Packing' : 'Storage',
            sortable: false,
        },
        {
            name: 'Amount',
            selector: row => row.price_total + " " + row.price_currency,
            sortable: false,
        },
        {
            name: 'Payment Status',
            selector: row => row.payment_status,
            sortable: false,
        },
        {
            name: 'Action',
            selector: row => {
                return (
                    <>
                        <button className='btn btn-xs' title='Invoice' onClick={() => handleInvoiceClick(row.id)}>
                            <i className='fa fa-file-text-o'></i>
                        </button>
                        <button type="button" className="btn btn-xs" title='See more..' data-toggle="modal" data-target={'#orderDetailsModal' + row.order_number}>
                            <i className='fa fa-eye'></i>
                        </button>
                        <PackageOrderModal order_details={row} />
                    </>
                )
            },
            sortable: true,
        },
    ];
    const data = orders

    return (
        <>
            <Head>
                <title> User: {pageTitle} </title>
                <link rel="stylesheet" href="/css/user-profile.css" />
            </Head>
            <section id="user-profile">
                <div className="container mb-4">
                    <Breadcrumb activeMenu={'/user/orders/storage'} title={pageTitle} />
                </div>
                <div className='container'>
                    <div className="row gutters-sm">
                        <UserBlock activeMenu={'storage-orders'} />
                        <div className="col-md-9">
                            <div className="card mb-3">
                                <div className="card-body">
                                    <div className="table-responsive">
                                        <DataTable
                                            title={pageTitle}
                                            columns={columns}
                                            data={data}
                                            pagination
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}

export default PackageOrders
