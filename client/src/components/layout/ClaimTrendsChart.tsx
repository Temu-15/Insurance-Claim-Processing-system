import React from "react";
import { getClaimTrends } from "../../services/analyticsService";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend
);

const ClaimTrendsChart: React.FC = () => {
  const [chartData, setChartData] = React.useState<any>(null);

  React.useEffect(() => {
    getClaimTrends().then((res) => {
      setChartData(res.data);
    });
  }, []);

  if (!chartData) return <div>Loading...</div>;
  return <Line data={chartData} options={options} />;
};

const options = {
  responsive: true,
  plugins: {
    legend: {
      position: "top" as const,
    },
    tooltip: {
      mode: "index" as const,
      intersect: false,
    },
  },
  scales: {
    y: {
      beginAtZero: true,
    },
  },
};

export default ClaimTrendsChart;
