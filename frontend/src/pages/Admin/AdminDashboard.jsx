import Chart from "react-apexcharts";
import { useGetUsersQuery } from "../../redux/api/usersApiSlice";
import {
  useGetTotalOrdersQuery,
  useGetTotalSalesByDateQuery,
  useGetTotalSalesQuery,
} from "../../redux/api/orderApiSlice";

import { useState, useEffect } from "react";
import AdminMenu from "./AdminMenu";
import OrderList from "./OrderList";
import Loader from "../../components/Loader";

const AdminDashboard = () => {
  const { data: sales, isLoading } = useGetTotalSalesQuery();
  const { data: customers, isLoading: loading } = useGetUsersQuery();
  const { data: orders, isLoading: loadingTwo } = useGetTotalOrdersQuery();
  const { data: salesDetail } = useGetTotalSalesByDateQuery();

  const [state, setState] = useState({
    options: {
      chart: {
        type: "line",
        toolbar: {
          show: false,
        },
        animations: {
          enabled: true,
        },
      },
      tooltip: {
        theme: "dark",
      },
      colors: ["#00E396"],
      dataLabels: {
        enabled: true,
      },
      stroke: {
        curve: "smooth",
      },
      title: {
        text: "Sales Trend",
        align: "left",
        style: {
          fontWeight: "bold",
          color: "#fff",
        },
      },
      grid: {
        borderColor: "#4B5563",
      },
      markers: {
        size: 4,
        colors: ["#00E396"],
        strokeColors: "#00E396",
      },
      xaxis: {
        categories: [],
        labels: {
          style: {
            colors: "#fff",
          },
        },
        title: {
          text: "Date",
          style: {
            color: "#fff",
          },
        },
      },
      yaxis: {
        labels: {
          style: {
            color: "#fff",
          },
        },
        title: {
          text: "Sales",
          style: {
            color: "#fff",
          },
        },
        min: 0,
      },
      legend: {
        position: "top",
        horizontalAlign: "right",
        floating: true,
        offsetY: -25,
        offsetX: -5,
        labels: {
          colors: "#fff",
        },
      },
    },
    series: [{ name: "Sales", data: [] }],
  });

  useEffect(() => {
    if (salesDetail) {
      const formattedSalesDate = salesDetail.map((item) => ({
        x: item._id,
        y: item.totalSales,
      }));

      setState((prevState) => ({
        ...prevState,
        options: {
          ...prevState.options,
          xaxis: {
            categories: formattedSalesDate.map((item) => item.x),
          },
        },
        series: [
          { name: "Sales", data: formattedSalesDate.map((item) => item.y) },
        ],
      }));
    }
  }, [salesDetail]);

  return (
    <>
      <AdminMenu />

      <section className="xl:ml-[4rem] md:ml-0">
        <div className="w-full flex justify-around flex-wrap">
          {/* Sales Card */}
          <div className="rounded-lg bg-gray-800 text-white p-5 w-[20rem] mt-5 shadow-lg hover:shadow-xl transition-shadow duration-300">
            <div className="font-bold rounded-full w-[3rem] bg-pink-500 text-center p-3">
              $
            </div>
            <p className="mt-5 text-gray-400">Sales</p>
            <h1 className="text-xl font-bold">
              $ {isLoading ? <Loader /> : sales?.totalSales?.toFixed(2)}
            </h1>
          </div>

          {/* Customers Card */}
          <div className="rounded-lg bg-gray-800 text-white p-5 w-[20rem] mt-5 shadow-lg hover:shadow-xl transition-shadow duration-300">
            <div className="font-bold rounded-full w-[3rem] bg-pink-500 text-center p-3">
              👥
            </div>
            <p className="mt-5 text-gray-400">Customers</p>
            <h1 className="text-xl font-bold">
              {loading ? <Loader /> : customers?.length}
            </h1>
          </div>

          {/* Orders Card */}
          <div className="rounded-lg bg-gray-800 text-white p-5 w-[20rem] mt-5 shadow-lg hover:shadow-xl transition-shadow duration-300">
            <div className="font-bold rounded-full w-[3rem] bg-pink-500 text-center p-3">
              📦
            </div>
            <p className="mt-5 text-gray-400">All Orders</p>
            <h1 className="text-xl font-bold">
              {loadingTwo ? <Loader /> : orders?.totalOrders}
            </h1>
          </div>
        </div>

        {/* Sales Chart */}
        <div className="ml-10 mt-12">
          <Chart
            options={state.options}
            series={state.series}
            type="line"
            width="70%"
            height="400"
          />
        </div>

        {/* Order List */}
        <div className="mt-12 ml-10">
          <OrderList />
        </div>
      </section>
    </>
  );
};

export default AdminDashboard;
