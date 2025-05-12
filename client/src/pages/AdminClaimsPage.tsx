import React from "react";
import AdminSidebar from "../components/layout/AdminSidebar";

import { getAllClaims, approveClaim, rejectClaim } from "../services/claimService";
import { getAllUsers } from "../services/userService";
import { getAllPolicies } from "../services/policyService";

const AdminClaimsPage: React.FC = () => {
  const [claims, setClaims] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [approvingId, setApprovingId] = React.useState<number | null>(null);
  const [rejectingId, setRejectingId] = React.useState<number | null>(null);
  const [viewClaim, setViewClaim] = React.useState<any | null>(null);
  const [users, setUsers] = React.useState<any[]>([]);
  const [policies, setPolicies] = React.useState<any[]>([]);

  React.useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      try {
        const [claimsRes, usersRes, policiesRes] = await Promise.all([
          getAllClaims(),
          getAllUsers(),
          getAllPolicies(),
        ]);
        setClaims(claimsRes.data);
        setUsers(usersRes.data);
        setPolicies(policiesRes.data);
      } catch (err) {
        setError("Failed to fetch claims, users, or policies");
      }
      setLoading(false);
    };
    fetchAll();
  }, []);

  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <main className="flex-1 p-8 bg-gray-50 ml-64">
        <h1 className="text-2xl font-bold mb-6 text-gray-800">Manage Claims</h1>
        <div className="overflow-x-auto">
          {loading && <div className="text-center py-4">Loading claims...</div>}
          {error && <div className="text-center py-4 text-red-600">{error}</div>}
          <table className="min-w-full divide-y divide-gray-200 border-0" style={{ borderBottom: 'none' }}>
  <thead className="bg-gray-50">
    <tr>
      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Claim Number</th>
      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount Requested</th>
      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
      <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
    </tr>
  </thead>
  <tbody className="bg-white divide-y divide-gray-200" style={{ borderBottom: 'none' }}>
              {claims.map((claim) => (
                <tr key={claim.claimId} className="hover:bg-gray-100 transition-colors">
                  <td className="py-3 px-6 text-[#154654] font-medium">{claim.claimNumber}</td>
                  <td className="py-3 px-6">{claim.userId}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">${Number(claim.amountRequested).toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
<td className="px-6 py-4 whitespace-nowrap">
  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
    claim.status === 'Approved'
      ? 'bg-green-100 text-green-800'
      : claim.status === 'Rejected'
      ? 'bg-red-100 text-red-800'
      : claim.status === 'Pending'
      ? 'bg-yellow-100 text-yellow-800'
      : 'bg-gray-100 text-gray-800'
  }`}>
    {claim.status}
  </span>
</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 flex gap-2 justify-center">
  <button
    className={`bg-green-700 opacity-80 hover:opacity-100 hover:bg-green-800 text-white text-xs font-semibold py-1 px-3 rounded transition-all duration-150 ${claim.status === 'Approved' ? 'opacity-40 cursor-not-allowed' : ''}`}
    onClick={async () => {
      setApprovingId(claim.claimId);
      try {
        await approveClaim(claim.claimId);
        setClaims((prev) => prev.map(c => c.claimId === claim.claimId ? { ...c, status: 'Approved' } : c));
      } catch {
        alert('Failed to approve claim');
      }
      setApprovingId(null);
    }}
    disabled={claim.status === 'Approved' || approvingId === claim.claimId}
  >
    {approvingId === claim.claimId ? 'Approving...' : 'Approve'}
  </button>
  <button
    className={`bg-red-700 opacity-80 hover:opacity-100 hover:bg-red-800 text-white text-xs font-semibold py-1 px-3 rounded transition-all duration-150 ${claim.status === 'Rejected' ? 'opacity-40 cursor-not-allowed' : ''}`}
    onClick={async () => {
      setRejectingId(claim.claimId);
      try {
        await rejectClaim(claim.claimId);
        setClaims((prev) => prev.map(c => c.claimId === claim.claimId ? { ...c, status: 'Rejected' } : c));
      } catch {
        alert('Failed to reject claim');
      }
      setRejectingId(null);
    }}
    disabled={claim.status === 'Rejected' || rejectingId === claim.claimId}
  >
    {rejectingId === claim.claimId ? 'Rejecting...' : 'Reject'}
  </button>
  <button
    className="bg-[#154654] opacity-80 hover:opacity-100 hover:bg-blue-900 text-white text-xs font-semibold py-1 px-3 rounded transition-all duration-150"
    onClick={() => setViewClaim(claim)}
  >
    View
  </button>
</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>

      {viewClaim && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="absolute inset-0 bg-blue-100/60 backdrop-blur-[2px] z-0"></div>
          <div className="relative bg-white rounded-2xl shadow-2xl p-10 w-full max-w-2xl border border-blue-100 transition-all duration-300 z-10">
            <button
              className="absolute top-4 right-4 text-gray-400 hover:text-blue-700 text-2xl font-bold focus:outline-none"
              onClick={() => setViewClaim(null)}
              title="Close"
            >
              &times;
            </button>
            <h2 className="text-3xl font-bold mb-6 text-blue-900 flex items-center gap-2">
              <svg className="w-8 h-8 text-blue-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-3-3v6m9 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              Claim Details
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
              <div>
                <div className="mb-3"><span className="font-semibold text-gray-700">Claim Number:</span> <span className="text-gray-900">{viewClaim.claimNumber}</span></div>
                <div className="mb-3"><span className="font-semibold text-gray-700">User Name:</span> <span className="text-gray-900">{(() => {
                  const user = users.find(u => u.userId === viewClaim.userId);
                  return user ? user.fullName || user.name || user.username || user.email : viewClaim.userId;
                })()}</span></div>
                <div className="mb-3"><span className="font-semibold text-gray-700">Amount Requested:</span> <span className="text-blue-700 font-bold">${viewClaim.amountRequested}</span></div>
                <div className="mb-3"><span className="font-semibold text-gray-700">Status:</span> <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold
                  ${viewClaim.status === 'Approved' ? 'bg-green-100 text-green-800 border border-green-300' :
                  viewClaim.status === 'Rejected' ? 'bg-red-100 text-red-800 border border-red-300' :
                  'bg-yellow-100 text-yellow-800 border border-yellow-300'}`}>{viewClaim.status}</span></div>
              </div>
              <div className="bg-gray-50 rounded-xl shadow-inner p-6 border border-gray-200">
                <h3 className="text-lg font-semibold mb-3 text-blue-700 flex items-center gap-2">
                  <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 1.343-3 3s1.343 3 3 3 3-1.343 3-3-1.343-3-3-3zm0 0V4m0 7v7m0 0H8m4 0h4" /></svg>
                  Policy Details
                </h3>
                <div className="space-y-2 text-sm">
                  {(() => {
  const claimPolicyId = String(viewClaim.policyId);
  const policy = policies.find(p => {
    return [p.policyId, p.id, p.policyNumber].map(x => String(x)).includes(claimPolicyId);
  });
  if (!policy) return <div className="text-red-500">Policy not found</div>;
  return (
    <>
      <div><span className="font-semibold text-gray-700">Policy Number:</span> <span className="text-gray-900">{policy.policyNumber || policy.policyId}</span></div>
      <div><span className="font-semibold text-gray-700">Policy Type:</span> <span className="text-gray-900">{policy.policyType || policy.type || '-'}</span></div>
      <div><span className="font-semibold text-gray-700">Coverage:</span> <span className="text-gray-900">{policy.coverage || '-'}</span></div>
      <div><span className="font-semibold text-gray-700">Start Date:</span> <span className="text-gray-900">{policy.startDate ? new Date(policy.startDate).toLocaleDateString() : '-'}</span></div>
      <div><span className="font-semibold text-gray-700">End Date:</span> <span className="text-gray-900">{policy.endDate ? new Date(policy.endDate).toLocaleDateString() : '-'}</span></div>
    </>
  );
})()}
                </div>
              </div>
            </div>
            <div className="mt-6">
              <h4 className="text-lg font-semibold mb-2 text-blue-900">Treatment Details</h4>
              <div className="bg-gray-100 rounded p-4 text-gray-800 whitespace-pre-line shadow-inner border border-gray-200">
                {viewClaim.treatmentDetails || <span className="italic text-gray-400">No treatment details provided.</span>}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminClaimsPage;
