import React from "react";
import AdminSidebar from "../components/layout/AdminSidebar";

// Dummy policy data for demonstration
const policies = [
  { id: 1, name: "Critical Care Insurance", type: "Health", premium: "ETB 120/year", status: "Active" },
  { id: 2, name: "Family Health Protection", type: "Family", premium: "ETB 200/year", status: "Active" },
  { id: 3, name: "Senior Citizen Health Cover", type: "Senior", premium: "ETB 300/year", status: "Inactive" },
];

const AdminPoliciesPage: React.FC = () => {
  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <main className="flex-1 p-8 bg-gray-50 ml-64">
        <h1 className="text-2xl font-bold mb-6 text-gray-800">Manage Policies</h1>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 border-0" style={{ borderBottom: 'none' }}>
  <thead className="bg-gray-50">
    <tr>
      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Policy Name</th>
      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Premium</th>
      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
      <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
    </tr>
  </thead>
  <tbody className="bg-white divide-y divide-gray-200" style={{ borderBottom: 'none' }}>
              {policies.map((policy) => (
                <tr key={policy.id} className="hover:bg-gray-100 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-[#154654] font-medium">{policy.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{policy.type}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{policy.premium}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
    policy.status === 'Active'
      ? 'bg-green-100 text-green-800'
      : 'bg-red-100 text-red-800'
  }`}>
    {policy.status}
  </span>
</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 flex gap-2 justify-center">
  <button className="bg-blue-700 opacity-80 hover:opacity-100 hover:bg-blue-900 text-white text-xs font-semibold py-1 px-3 rounded transition-all duration-150">Edit</button>
  <button className="bg-yellow-500 opacity-80 hover:opacity-100 hover:bg-yellow-600 text-white text-xs font-semibold py-1 px-3 rounded transition-all duration-150">Deactivate</button>
  <button className="bg-red-700 opacity-80 hover:opacity-100 hover:bg-red-800 text-white text-xs font-semibold py-1 px-3 rounded transition-all duration-150">Delete</button>
</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
};

export default AdminPoliciesPage;
