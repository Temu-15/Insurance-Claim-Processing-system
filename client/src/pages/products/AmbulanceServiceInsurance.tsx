import React from "react";
import Sidebar from "../../components/layout/Sidebar";
import { productsData } from "../../../public/data/Products";
import ProductTabs from "../../components/layout/ProductTabs";

const AmbulanceServiceInsurance: React.FC = () => {
  const product = productsData.find(
    (p: { id: string }) => p.id === "ambulance-service"
  );

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 p-8 bg-gray-50">
        {product && <ProductTabs product={product} />}
      </main>
    </div>
  );
};

export default AmbulanceServiceInsurance;
