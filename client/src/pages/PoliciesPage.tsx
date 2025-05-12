import Sidebar from "../components/layout/Sidebar";
import Button from "../components/ui/Button";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getUserPolicies } from "../services/policyService";

import { ApplicationStatus } from "../enums/ApplicationStatus.enum";

const columns = [
  "Policy Number",
  "Product Id",
  "Status",
  "Start Date",
  "End Date",
];

export interface Policy {
  policyId: string;
  policyNumber: string;
  productId: string;
  status: ApplicationStatus;
  startDate: Date | string;
  endDate: Date | string;
}

const getStatusColor = (status: string) => {
  switch ((status || "").toLowerCase()) {
    case "approved":
      return "bg-green-100 text-green-800";
    case "submitted":
      return "bg-blue-100 text-blue-800";
    case "pending":
      return "bg-yellow-100 text-yellow-800";
    case "rejected":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

import { useLocation } from "react-router-dom";

const PoliciesPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [policies, setPolicies] = useState<Policy[]>([]);

  // Helper to get status from query string
  const getStatusFromQuery = () => {
    const params = new URLSearchParams(location.search);
    return params.get("status")?.toLowerCase() || null;
  };
  const statusFilter = getStatusFromQuery();

  const statusOptions = [
    "All",
    "Active",
    "Pending",
    "Approved",
    "Rejected",
    "Expired",
  ];

  useEffect(() => {
    const fetchPolicies = async () => {
      try {
        const response = await getUserPolicies();
        const policiesData = response.data;
        console.log("Policies Data:", policiesData);
        setPolicies(policiesData);
      } catch (error) {
        console.error("Error fetching policies:", error);
      }
    };
    fetchPolicies();
  }, [location.search]);

  return (
    <main className="flex flex-claim">
      <div>
        <Sidebar />
      </div>
      <div className="w-screen p-10">
        <h1 className="font-bold text-[1.5rem]">Policies</h1>
        <div className="mt-5">
          <Button
            onClick={() => navigate("/user/new-policy")}
            text="Create a New Policy"
          />
        </div>
        <div className="flex flex-wrap gap-3 items-center mb-6 mt-10">
          <span className="font-semibold text-gray-700 mr-2 text-sm">
            Filter by status:
          </span>
          {statusOptions.map((status) => {
            const isActive =
              (statusFilter === null && status === "All") ||
              (statusFilter && status.toLowerCase() === statusFilter);
            const colorMap: Record<string, string> = {
              All: "bg-gray-100 text-gray-700",
              Active: "bg-green-100 text-green-800",
              Approved: "bg-green-100 text-green-800",
              Pending: "bg-yellow-100 text-yellow-800",
              Rejected: "bg-red-100 text-red-800",
              Expired: "bg-gray-300 text-gray-600",
            };
            return (
              <button
                key={status}
                className={`px-4 py-1.5 rounded-full shadow-sm text-xs font-bold transition-all border border-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-400 hover:scale-105 duration-150 ${
                  colorMap[status] || "bg-gray-100 text-gray-700"
                } ${
                  isActive
                    ? "ring-2 ring-blue-500 scale-105"
                    : "opacity-80 hover:opacity-100"
                }`}
                style={{
                  boxShadow: isActive
                    ? "0 2px 8px 0 rgba(30, 64, 175, 0.08)"
                    : undefined,
                }}
                onClick={() => {
                  if (status === "All") {
                    navigate(location.pathname);
                  } else {
                    navigate(
                      `${location.pathname}?status=${status.toLowerCase()}`
                    );
                  }
                }}
              >
                {status}
              </button>
            );
          })}
        </div>
        <div className="overflow-x-auto mt-8">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {columns.map((col) => (
                  <th
                    key={col}
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {policies
                .filter(
                  (policy) =>
                    !statusFilter ||
                    (statusFilter === "active" &&
                      policy.status?.toLowerCase() === "active") ||
                    (statusFilter !== "active" &&
                      policy.status?.toLowerCase() === statusFilter)
                )
                .map((policy, idx) => (
                  <tr key={idx}>
                    {columns.map((col, colIdx) => {
                      if (col === "Status") {
                        return (
                          <td
                            key={colIdx}
                            className="px-6 py-4 whitespace-nowrap"
                          >
                            <span
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                                policy.status
                              )}`}
                            >
                              {policy.status}
                            </span>
                          </td>
                        );
                      }
                      const fieldMap: Record<string, string> = {
                        "Policy Number": "policyNumber",
                        "Product Id": "productId",
                        "Start Date": "startDate",
                        "End Date": "endDate",
                      };
                      const field =
                        fieldMap[col] || col.toLowerCase().replace(/ /g, "_");
                      let value = policy[field as keyof Policy];
                      // Format dates for display
                      if (
                        (field === "startDate" || field === "endDate") &&
                        value
                      ) {
                        value = new Date(value).toLocaleDateString();
                      }
                      // Ensure value is not a Date object before rendering
                      if (value instanceof Date) {
                        value = value.toLocaleDateString();
                      }
                      return (
                        <td
                          key={colIdx}
                          className="px-6 py-4 whitespace-nowrap text-sm text-gray-500"
                        >
                          {value}
                        </td>
                      );
                    })}
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
};

export default PoliciesPage;
