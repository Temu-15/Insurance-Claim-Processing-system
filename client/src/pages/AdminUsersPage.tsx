import React, { useEffect, useState } from "react";
import { getAllUsers, deleteUser, deactivateUser } from "../services/userService";
import Swal from 'sweetalert2';
import AdminSidebar from "../components/layout/AdminSidebar";


const AdminUsersPage: React.FC = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any | null>(null);

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getAllUsers();
      setUsers(response.data);
    } catch (err: any) {
      setError("Failed to fetch users");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDelete = async (userId: number) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: 'You won\'t be able to revert this!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!'
    });
    if (!result.isConfirmed) return;
    setLoading(true);
    setError(null);
    try {
      await deleteUser(userId);
      await fetchUsers();
      await Swal.fire('Deleted!', 'User has been deleted.', 'success');
    } catch (err: any) {
      setError("Failed to delete user");
      await Swal.fire('Error', 'Failed to delete user', 'error');
    }
    setLoading(false);
  };



  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <main className="flex-1 p-8 bg-gray-50 ml-64">
        <h1 className="text-2xl font-bold mb-6 text-gray-800">Manage Users</h1>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 border-0" style={{ borderBottom: "none" }}>
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Full Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Age</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date of Birth</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.userId} className="hover:bg-gray-100 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-[#154654] font-medium">{user.fullName}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{user.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{user.age}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{user.dob ? new Date(user.dob).toISOString().slice(0,10) : ''}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{user.isAdmin ? 'Admin' : 'User'}</td>
                  <td className="px-6 py-4 whitespace-nowrap flex gap-2 justify-center">
                    <button
                      className="bg-red-100 text-red-800 border border-red-300 hover:bg-red-200 hover:text-red-900 text-xs font-semibold py-1 px-3 rounded transition-all duration-150"
                      onClick={() => handleDelete(user.userId)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {modalOpen && (
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center">
              <div className="bg-white rounded-lg shadow p-4">
                <h2 className="text-lg font-bold mb-2">Edit User</h2>
                <p>Selected User: {selectedUser.fullName}</p>
                {/* Add form to update user info */}
              </div>
            </div>
          )}

          {error && (
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center">
              <div className="bg-white rounded-lg shadow p-4">
                <h2 className="text-lg font-bold mb-2">Error</h2>
                <p>{error}</p>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default AdminUsersPage;
