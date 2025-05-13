import React from "react";
import AdminSidebar from "../components/layout/AdminSidebar";

import {
  getAllPolicies,
  approvePolicy,
  rejectPolicy,
  deletePolicy,
} from "../services/policyService";
import { getAllUsers } from "../services/userService";
import Swal from "sweetalert2";


const AdminPoliciesPage: React.FC = () => {
  const [policies, setPolicies] = React.useState<any[]>([]);
  const [statusFilter, setStatusFilter] = React.useState<string>("");
  const statusOptions = ["All", "Active", "Pending", "Approved", "Rejected", "Expired"];
  const [users, setUsers] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [actionLoading, setActionLoading] = React.useState<{
    [id: number]: string | null;
  }>({});

  React.useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const [policiesRes, usersRes] = await Promise.all([
          getAllPolicies(),
          getAllUsers(),
        ]);
        setPolicies(policiesRes.data);
        setUsers(usersRes.data);
      } catch (err) {
        setError("Failed to fetch policies, users, or products");
      }
      setLoading(false);
    };
    fetchData();
  }, []);

  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <main className="flex-1 p-8 bg-gray-50 ml-64">
        <h1 className="text-2xl font-bold mb-6 text-gray-800">
          Manage Policies
        </h1>
        <div className="flex flex-wrap gap-3 items-center mb-6 mt-2">
  <span className="font-semibold text-gray-700 mr-2 text-sm">Filter by status:</span>
  {statusOptions.map((status) => {
    const isActive = (statusFilter === "" && status === "All") || (statusFilter && status.toLowerCase() === statusFilter.toLowerCase());
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
        className={`px-4 py-1.5 rounded-full shadow-sm text-xs font-bold transition-all border border-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-400 hover:scale-105 duration-150 ${colorMap[status] || "bg-gray-100 text-gray-700"} ${
          isActive ? "ring-2 ring-blue-500 scale-105" : "opacity-80 hover:opacity-100"
        }`}
        style={{
          boxShadow: isActive ? "0 2px 8px 0 rgba(30, 64, 175, 0.08)" : undefined,
        }}
        onClick={() => {
          if (status === "All") {
            setStatusFilter("");
          } else {
            setStatusFilter(status.toLowerCase());
          }
        }}
      >
        {status}
      </button>
    );
  })}
</div>
<div className="overflow-x-auto">
          {loading ? (
            <div className="p-4">Loading policies...</div>
          ) : error ? (
            <div className="p-4 text-red-500">{error}</div>
          ) : (
            <>
              <table
                className="min-w-full divide-y divide-gray-200 border-0"
                style={{ borderBottom: "none" }}
              >
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Policy Number
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Product ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      User
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Start Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      End Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>

                    <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {policies
                    .filter((policy) =>
                      !statusFilter ||
                      (statusFilter === "active" && policy.status?.toLowerCase() === "active") ||
                      (statusFilter !== "active" && policy.status?.toLowerCase() === statusFilter)
                    )
                    .map((policy) => (
                      <tr
                        key={policy.policyId}
                        className="hover:bg-gray-100 transition-colors"
                      >
                        <td className="px-6 py-4 whitespace-nowrap text-[#154654] font-medium">
  {policy.policyNumber}
</td>
<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
  {policy.productId}
</td>
<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
  {users.length > 0
    ? users.find((u) => u.userId === policy.userId)?.userName || "Unknown"
    : "Loading..."}
</td>
<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
  {policy.startDate ? new Date(policy.startDate).toLocaleDateString() : ""}
</td>
<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
  {policy.endDate ? new Date(policy.endDate).toLocaleDateString() : ""}
</td>
<td className="px-6 py-4 whitespace-nowrap">
  <span
    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
      policy.status === "approved" || policy.status === "active"
        ? "bg-green-100 text-green-800"
        : policy.status === "rejected" || policy.status === "inactive"
        ? "bg-red-100 text-red-800"
        : "bg-yellow-100 text-yellow-800"
    }`}
    style={{ textTransform: "capitalize" }}
  >
    {policy.status}
  </span>
</td>

                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 flex gap-2 justify-center">
                        <button
                          className={`bg-green-100 text-green-800 border border-green-300 hover:bg-green-200 hover:text-green-900 text-xs font-semibold py-1 px-3 rounded transition-all duration-150 ${
                            policy.status === "approved" ||
                            policy.status === "active"
                              ? "opacity-40 cursor-not-allowed"
                              : ""
                          }`}
                          disabled={
                            policy.status === "approved" ||
                            actionLoading[policy.policyId] === "approve"
                          }
                          onClick={async () => {
                            setActionLoading((prev) => ({
                              ...prev,
                              [policy.policyId]: "approve",
                            }));
                            try {
                              await approvePolicy(policy.policyId);
                              setPolicies((prev) =>
                                prev.map((p) =>
                                  p.policyId === policy.policyId
                                    ? { ...p, status: "approved" }
                                    : p
                                )
                              );
                            } catch (err) {
                              await Swal.fire(
                                "Error",
                                "Failed to approve policy",
                                "error"
                              );
                            }
                            setActionLoading((prev) => ({
                              ...prev,
                              [policy.policyId]: null,
                            }));
                          }}
                        >
                          {actionLoading[policy.policyId] === "approve"
                            ? "Approving..."
                            : "Approve"}
                        </button>
                        <button
                          className={`bg-yellow-100 text-yellow-800 border border-yellow-300 hover:bg-yellow-200 hover:text-yellow-900 text-xs font-semibold py-1 px-3 rounded transition-all duration-150 ${
                            policy.status === "rejected" ||
                            policy.status === "inactive"
                              ? "opacity-40 cursor-not-allowed"
                              : ""
                          }`}
                          disabled={
                            policy.status === "rejected" ||
                            actionLoading[policy.policyId] === "reject"
                          }
                          onClick={async () => {
                            setActionLoading((prev) => ({
                              ...prev,
                              [policy.policyId]: "reject",
                            }));
                            try {
                              await rejectPolicy(policy.policyId);
                              setPolicies((prev) =>
                                prev.map((p) =>
                                  p.policyId === policy.policyId
                                    ? { ...p, status: "rejected" }
                                    : p
                                )
                              );
                            } catch (err) {
                              await Swal.fire(
                                "Error",
                                "Failed to reject policy",
                                "error"
                              );
                            }
                            setActionLoading((prev) => ({
                              ...prev,
                              [policy.policyId]: null,
                            }));
                          }}
                        >
                          {actionLoading[policy.policyId] === "reject"
                            ? "Rejecting..."
                            : "Reject"}
                        </button>
                        <button
                          className="bg-red-100 text-red-800 border border-red-300 hover:bg-red-200 hover:text-red-900 text-xs font-semibold py-1 px-3 rounded transition-all duration-150"
                          disabled={actionLoading[policy.policyId] === "delete"}
                          onClick={async () => {
                            const result = await Swal.fire({
                              title: "Are you sure?",
                              text: "You won't be able to revert this!",
                              icon: "warning",
                              showCancelButton: true,
                              confirmButtonColor: "#d33",
                              cancelButtonColor: "#3085d6",
                              confirmButtonText: "Yes, delete it!",
                            });
                            if (!result.isConfirmed) return;
                            setActionLoading((prev) => ({
                              ...prev,
                              [policy.policyId]: "delete",
                            }));
                            try {
                              await deletePolicy(policy.policyId);
                              setPolicies((prev) =>
                                prev.filter(
                                  (p) => p.policyId !== policy.policyId
                                )
                              );
                              await Swal.fire(
                                "Deleted!",
                                "Policy has been deleted.",
                                "success"
                              );
                            } catch (err) {
                              await Swal.fire(
                                "Error",
                                "Failed to delete policy",
                                "error"
                              );
                            }
                            setActionLoading((prev) => ({
                              ...prev,
                              [policy.policyId]: null,
                            }));
                          }}
                        >
                          {actionLoading[policy.policyId] === "delete"
                            ? "Deleting..."
                            : "Delete"}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default AdminPoliciesPage;
