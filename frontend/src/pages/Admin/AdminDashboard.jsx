import Chart from "react-apexcharts";
import { useGetUsersQuery } from "../../redux/api/usersApiSlice";
import {
  useGetTotalOrdersQuery,
  useGetTotalSalesByDateQuery,
  useGetTotalSalesQuery,
} from "../../redux/api/orderApiSlice";
import React, { useEffect, useState } from 'react';
import AdminMenu from "./AdminMenu";
import OrderList from "./OrderList";
import Loader from "../../components/Loader";

const AdminDashboard = () => {
    const { data: sales, isLoading: loadingSales } = useGetTotalSalesQuery();
    const { data: customers, isLoading: loadingCustomers } = useGetUsersQuery();
    const { data: orders, isLoading: loadingOrders } = useGetTotalOrdersQuery();


    const [chartState, setChartState] = useState({
        options: {
            chart: {
                type: 'scatter',
                toolbar: {
                    show: false,
                },
                zoom: {
                    type: 'xy',
                },
                background: 'transparent',
            },
            colors: ['white'], // gray-300
            xaxis: {
                title: {
                    text: 'Total Customers',
                    style: {
                        color: 'white', // gray-700
                    },
                },
                labels: {
                    style: {
                        fontSize: '12px',
                        color: 'white', // gray-700
                    },
                },
            },
            yaxis: {
                title: {
                    text: 'Total Sales ($)',
                    style: {
                        color: 'white', // gray-700
                    },
                },
                labels: {
                    style: {
                        fontSize: '12px',
                        color: 'white', // gray-700
                    },
                },
            },
            tooltip: {
                theme: 'dark',
                style: {
                    fontSize: '12px',
                    background: '#1F2937', // gray-800
                    color: 'white', // gray-300
                },
            },
            dataLabels: {
                enabled: true,
                style: {
                    colors: ['#374151'], // gray-700
                },
                formatter: (value) => `$${value.toFixed(2)}`,
            },
        },
        series: [],
    });

    useEffect(() => {
        if (sales && customers) {
            const dataPoint = {
                x: customers.length,
                y: sales.totalSales,
            };

            setChartState((prevState) => ({
                ...prevState,
                series: [
                    {
                        name: 'Total Sales vs Total Customers',
                        data: [dataPoint],
                    },
                ],
            }));
        }
    }, [sales, customers]);

    return (
        <>
            <AdminMenu />
            <section className="xl:ml-16 md:ml-0 mt-8">
                {/* Dashboard cards */}
                <div className="flex flex-wrap justify-around">
                    {/* Sales Card */}
                    <div className="rounded-lg bg-gray-800 text-white p-6 w-1/4 mx-2 my-3 shadow-lg hover:shadow-xl transition-shadow duration-300">
                        <div className="rounded-full w-12 h-12 flex items-center justify-center bg-pink-500 text-white">
                            $
                        </div>
                        <p className="mt-4 text-gray-400">Sales</p>
                        <h1 className="text-xl font-bold">
                            {loadingSales ? <Loader /> : `$${sales?.totalSales?.toFixed(2)}`}
                        </h1>
                    </div>

                    {/* Customers Card */}
                    <div className="rounded-lg bg-gray-800 text-white p-6 w-1/4 mx-2 my-3 shadow-lg hover:shadow-xl transition-shadow duration-300">
                        <div className="rounded-full w-12 h-12 flex items-center justify-center bg-pink-500 text-white">
                            👥
                        </div>
                        <p className="mt-4 text-gray-400">Customers</p>
                        <h1 className="text-xl font-bold">
                            {loadingCustomers ? <Loader /> : customers?.length}
                        </h1>
                    </div>

                    {/* Orders Card */}
                    <div className="rounded-lg bg-gray-800 text-white p-6 w-1/4 mx-2 my-3 shadow-lg hover:shadow-xl transition-shadow duration-300">
                        <div className="rounded-full w-12 h-12 flex items-center justify-center bg-pink-500 text-white">
                            📦
                        </div>
                        <p className="mt-4 text-gray-400">Orders</p>
                        <h1 className="text-xl font-bold">
                        {loadingOrders ? <Loader /> : orders?.totalOrders}
                        </h1>
                    </div>
                </div>

                {/* Chart */}
                <section className="mt-12 px-4">
                    <div className="rounded-lg p-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
                        <h2 className="text-xl font-bold mb-4 text-white">Total Sales vs Total Customers</h2>
                        <div className="mx-auto w-full max-w-[80%]">
                            <Chart
                                options={chartState.options}
                                series={chartState.series}
                                width="100%"
                                height={400}
                            />
                        </div>
                    </div>
                </section>

                {/* Order List */}
                <div className="mt-12 px-4">
                    <OrderList />
                </div>
            </section>
        </>
    );
};

export default AdminDashboard;
