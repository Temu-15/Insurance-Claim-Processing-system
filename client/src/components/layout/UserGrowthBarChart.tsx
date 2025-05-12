import React from "react";
import { getUserGrowth } from "../../services/analyticsService";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const UserGrowthBarChart: React.FC = () => {
  const [userData, setUserData] = React.useState<any>(null);

  React.useEffect(() => {
    getUserGrowth().then((res) => {
      setUserData(res.data);
    });
  }, []);

  if (!userData) return <div>Loading...</div>;
  return <Bar data={userData} options={options} />;
};

const options = {
  responsive: true,
  plugins: {
    legend: {
      position: "top" as const,
    },
    title: {
      display: true,
      text: "User Growth Over Time",
    },
  },
};

// Removed duplicate declaration of UserGrowthBarChart

export default UserGrowthBarChart;
