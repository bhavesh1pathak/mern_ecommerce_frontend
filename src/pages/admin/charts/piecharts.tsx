import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import AdminSidebar from "../../../components/admin/AdminSidebar";
import { DoughnutChart, PieChart } from "../../../components/admin/Charts";
import { Skeleton } from "../../../components/loader";
import { usePieQuery } from "../../../redux/api/dashboardAPI";
import { RootState } from "../../../redux/store";
import { Navigate } from "react-router-dom";

const PieCharts = () => {
  const { user } = useSelector((state: RootState) => state.userReducer);
  const { isLoading, data, isError } = usePieQuery(user?._id!);

  if (isError) {
    toast.error("Failed to fetch data.");
    return <Navigate to={"/admin/dashboard"} />;
  }

  const order = data?.charts.orderFullfillment!;
  const categories = data?.charts.productCategories!;
  const stock = data?.charts.stockAvailability!;
  const revenue = data?.charts.revenueDistribution!;
  const ageGroup = data?.charts.usersAgeGroup!;
  const adminCustomer = data?.charts.adminCustomer!;

  const sectionStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginBottom: '2rem',
  };

  const chartBoxStyle: React.CSSProperties = {
    width: '50%',
    padding: '1rem',
    background: '#fff',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    borderRadius: '8px',
    marginBottom: '1rem',
  };

  const chartTitleStyle: React.CSSProperties = {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    color: '#333',
  };

  return (
    <div className="admin-container">
      <AdminSidebar />
      <main className="chart-container">
        <h1>Pie & Doughnut Charts</h1>
        {isLoading ? (
          <Skeleton length={20} />
        ) : (
          <>
            <section style={sectionStyle}>
              <div style={chartBoxStyle}>
                <PieChart
                  labels={["Processing", "Shipped", "Delivered"]}
                  data={[order.processing, order.shipped, order.delivered]}
                  backgroundColor={[
                    `hsl(210,100%, 70%)`,
                    `hsl(120,100%,70%)`,
                    `hsl(60,100%, 70%)`,
                  ]}
                  offset={[0, 0, 50]}
                />
              </div>
              <h2 style={chartTitleStyle}>Order Fulfillment Ratio</h2>
            </section>

            <section style={sectionStyle}>
              <div style={chartBoxStyle}>
                <DoughnutChart
                  labels={categories.map((i) => Object.keys(i)[0]) || []}
                  data={categories.map((i) => Object.values(i)[0]) || []}
                  backgroundColor={[
                    "hsl(210, 100%, 70%)",
                    "hsl(120, 100%, 70%)",
                    "hsl(60, 100%, 70%)",
                    "hsl(30, 100%, 70%)",
                    "hsl(360, 100%, 70%)",
                    "hsl(180, 100%, 70%)"
                  ]}
                  legends={false}
                  offset={[0, 0, 0, 80]}
                />
              </div>
              <h2 style={chartTitleStyle}>Product Categories Ratio</h2>
            </section>

            <section style={sectionStyle}>
              <div style={chartBoxStyle}>
                <DoughnutChart
                  labels={["In Stock", "Out Of Stock"]}
                  data={[stock.inStock, stock.outOfStock]}
                  backgroundColor={["hsl(269,80%,40%)", "rgb(53, 162, 255)"]}
                  legends={false}
                  offset={[0, 80]}
                  cutout={"70%"}
                />
              </div>
              <h2 style={chartTitleStyle}>Stock Availability</h2>
            </section>

            <section style={sectionStyle}>
              <div style={chartBoxStyle}>
                <DoughnutChart
                  labels={[
                    "Marketing Cost",
                    "Discount",
                    "Burnt",
                    "Production Cost",
                    "Net Margin",
                  ]}
                  data={[revenue.marketingCost, revenue.discount, revenue.burnt, revenue.productionCost, revenue.netMargin]}
                  backgroundColor={[
                    "hsl(110,80%,40%)",
                    "hsl(19,80%,40%)",
                    "hsl(69,80%,40%)",
                    "hsl(300,80%,40%)",
                    "rgb(53, 162, 255)",
                  ]}
                  legends={false}
                  offset={[20, 30, 20, 30, 80]}
                />
              </div>
              <h2 style={chartTitleStyle}>Revenue Distribution</h2>
            </section>

            <section style={sectionStyle}>
              <div style={chartBoxStyle}>
                <PieChart
                  labels={[
                    "Teenager(Below 20)",
                    "Adult (20-40)",
                    "Older (above 40)",
                  ]}
                  data={[ageGroup.teen, ageGroup.adult, ageGroup.old]}
                  backgroundColor={[
                    `hsl(10, ${80}%, 80%)`,
                    `hsl(10, ${80}%, 50%)`,
                    `hsl(10, ${40}%, 50%)`,
                  ]}
                  offset={[0, 0, 50]}
                />
              </div>
              <h2 style={chartTitleStyle}>Users Age Group</h2>
            </section>

            <section style={sectionStyle}>
              <div style={chartBoxStyle}>
                <DoughnutChart
                  labels={["Admin", "Customers"]}
                  data={[adminCustomer.admin, adminCustomer.customer]}
                  backgroundColor={[`hsl(335, 100%, 38%)`, "hsl(44, 98%, 50%)"]}
                  offset={[0, 50]}
                />
              </div>
              <h2 style={chartTitleStyle}>User Roles</h2>
            </section>
          </>
        )}
      </main>
    </div>
  );
};

export default PieCharts;
