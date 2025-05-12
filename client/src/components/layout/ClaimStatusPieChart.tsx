import React from "react";
import { getClaimStatusBreakdown } from "../../services/analyticsService";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

const ClaimStatusPieChart: React.FC = () => {
  const [pieData, setPieData] = React.useState<any>(null);

  React.useEffect(() => {
    getClaimStatusBreakdown().then((res) => {
      setPieData(res.data);
    });
  }, []);

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "bottom" as const,
      },
    },
  };

  if (!pieData) return <div>Loading...</div>;
  return <Pie data={pieData} options={options} />;
};

export default ClaimStatusPieChart;
