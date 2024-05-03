import React, { useState, useEffect } from "react";
import Chart from "react-apexcharts";
import { useGetUsersQuery } from "../../redux/api/usersApiSlice";
import {
  useGetTotalOrdersQuery,
  useGetTotalSalesQuery,
  useGetTotalSalesByDateQuery,
} from "../../redux/api/orderApiSlice";
import AdminMenu from "./AdminMenu";
import OrderList from "./OrderList";
import Loader from "../../components/Loader";

const AdminDashboard = () => {
  // Fetch data from APIs
  const { data: sales, isLoading: loadingSales } = useGetTotalSalesQuery();
  const { data: customers, isLoading: loadingCustomers } = useGetUsersQuery();
  const { data: orders, isLoading: loadingOrders } = useGetTotalOrdersQuery();
  const { data: salesDetail } = useGetTotalSalesByDateQuery();

  // Initialize chart state
  const [lineChartState, setLineChartState] = useState({
    options: {
      chart: {
        type: "line",
        toolbar: {
          show: false,
        },
        animations: {
          enabled: true,
        },
        background: "transparent",
      },
      tooltip: {
        theme: "dark",
        style: {
          fontSize: "12px",
        },
      },
      colors: ["#00E396"],
      dataLabels: {
        enabled: true,
        style: {
          colors: ["#fff"],
        },
        formatter: (value) => `$${value.toFixed(2)}`,
      },
      stroke: {
        curve: "smooth",
        width: 2,
      },
      grid: {
        borderColor: "#4B5563",
        strokeDashArray: 3,
        xaxis: {
          lines: {
            show: true,
            color: "#f2f2f2",
          },
        },
        yaxis: {
          lines: {
            show: true,
            color: "#f2f2f2",
          },
        },
      },
      markers: {
        size: 5,
        colors: ["#00E396"],
        strokeColors: "#fff",
        strokeWidth: 2,
        hover: {
          size: 7,
          sizeOffset: 2,
        },
      },
      xaxis: {
        categories: [],
        labels: {
          style: {
            colors: "#fff",
            fontSize: "12px",
          },
        },
        title: {
          text: "Date",
          style: {
            color: "#fff",
            fontWeight: "bold",
          },
        },
        axisBorder: {
          show: true,
          color: "#fff",
        },
        axisTicks: {
          show: true,
          color: "#fff",
        },
      },
      yaxis: {
        labels: {
          style: {
            color: "#fff",
            fontSize: "12px",
          },
        },
        title: {
          text: "Sales ($)",
          style: {
            color: "#fff",
            fontWeight: "bold",
          },
        },
        min: 0,
        forceNiceScale: true,
        axisBorder: {
          show: true,
          color: "#fff",
        },
        axisTicks: {
          show: true,
          color: "#fff",
        },
      },
      legend: {
        position: "top",
        horizontalAlign: "right",
        offsetY: -15,
        labels: {
          colors: "#fff",
          style: {
            fontSize: "12px",
          },
        },
        markers: {
          width: 10,
          height: 10,
          colors: ["#00E396"],
        },
      },
    },
    series: [{ name: "Sales", data: [] }],
  });

  // Process sales data and update the chart state
  useEffect(() => {
    if (salesDetail) {
      // Check if salesDetail is an array and not empty
      if (Array.isArray(salesDetail) && salesDetail.length > 0) {
        // Map the salesDetail data into the format required for the chart
        const formattedSalesData = salesDetail.map((item) => ({
          x: item._id, // Assuming item._id is the date
          y: item.totalSales, // Assuming item.totalSales is the sales amount
        }));

        // Debugging logs to check data
        console.log("Sales detail:", salesDetail);
        console.log("Formatted sales data:", formattedSalesData);

        // Update the line chart state with the formatted data
        setLineChartState((prevState) => ({
          ...prevState,
          options: {
            ...prevState.options,
            xaxis: {
              categories: formattedSalesData.map((item) => item.x),
            },
          },
          series: [
            { name: "Sales", data: formattedSalesData.map((item) => item.y) },
          ],
        }));
      } else {
        console.error("Invalid salesDetail data:", salesDetail);
      }
    }
  }, [salesDetail]);

  return (
    <>
      <AdminMenu />

      <section className="xl:ml-16 md:ml-0 mt-8">
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

        {/* Sales Chart */}
        <div className="mt-12 px-4">
          <div className="bg-gray-800 rounded-lg p-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
            <h2 className="text-xl font-bold mb-4 text-white">Sales Trend</h2>
            <div className="mx-auto w-full max-w-[80%]">
              <Chart
                options={lineChartState.options}
                series={lineChartState.series}
                type="line"
                width="100%"
                height={400}
              />
            </div>
          </div>
        </div>

        {/* Order List */}
        <div className="mt-12 px-4">
          <OrderList />
        </div>
      </section>
    </>
  );
};

export default AdminDashboard;
