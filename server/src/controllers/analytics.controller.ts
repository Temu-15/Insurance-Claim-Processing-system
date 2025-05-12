import { Request, Response } from "express";
import { ClaimService } from "../services/claim.service";
import { UserService } from "../services/user.service";

// GET /api/analytics/claim-trends
export async function getClaimTrends(req: Request, res: Response) {
  try {
    const claims = await ClaimService.getAllClaims();
    // Aggregate by month (last 12 months)
    const now = new Date();
    const months = Array.from({ length: 12 }, (_, i) => {
      const d = new Date(now.getFullYear(), now.getMonth() - 11 + i, 1);
      return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    });
    const submitted: number[] = Array(12).fill(0);
    const approved: number[] = Array(12).fill(0);
    const rejected: number[] = Array(12).fill(0);
    claims.forEach((claim: any) => {
      const date = new Date(claim.createdAt);
      const label = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      const idx = months.indexOf(label);
      if (idx !== -1) {
        submitted[idx]++;
        if (claim.status?.toLowerCase() === 'approved') approved[idx]++;
        if (claim.status?.toLowerCase() === 'rejected') rejected[idx]++;
      }
    });
    res.json({
      labels: months,
      datasets: [
        { label: 'Claims Submitted', data: submitted, borderColor: '#3b82f6', backgroundColor: 'rgba(59,130,246,0.1)', tension: 0.4, fill: true },
        { label: 'Claims Approved', data: approved, borderColor: '#22c55e', backgroundColor: 'rgba(34,197,94,0.1)', tension: 0.4, fill: true },
        { label: 'Claims Rejected', data: rejected, borderColor: '#ef4444', backgroundColor: 'rgba(239,68,68,0.1)', tension: 0.4, fill: true },
      ],
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to get claim trends' });
  }
}

// GET /api/analytics/claim-status-breakdown
export async function getClaimStatusBreakdown(req: Request, res: Response) {
  try {
    const claims = await ClaimService.getAllClaims();
    const statusCounts: Record<string, number> = {};
    claims.forEach((claim: any) => {
      const status = (claim.status || 'Unknown').toLowerCase();
      statusCounts[status] = (statusCounts[status] || 0) + 1;
    });
    const labels = Object.keys(statusCounts).map(s => s.charAt(0).toUpperCase() + s.slice(1));
const data = Object.values(statusCounts);
// Representative colors: Approved (green), Pending (yellow), Rejected (red), fallback (blue, purple)
const colorMap: Record<string, string> = {
  approved: '#22c55e', // green
  pending: '#facc15',  // yellow
  rejected: '#ef4444', // red
};
const fallbackColors = ['#3b82f6', '#a855f7'];
const backgroundColor = Object.keys(statusCounts).map((status, idx) => colorMap[status] || fallbackColors[idx % fallbackColors.length]);
res.json({
  labels,
  datasets: [
    {
      label: 'Claims',
      data,
      backgroundColor,
      borderWidth: 1,
    },
  ],
});
  } catch (error) {
    res.status(500).json({ message: 'Failed to get claim status breakdown' });
  }
}

// GET /api/analytics/user-growth
export async function getUserGrowth(req: Request, res: Response) {
  try {
    const users = await UserService.getAllUsers();
    // Aggregate by month (last 12 months)
    const now = new Date();
    const months = Array.from({ length: 12 }, (_, i) => {
      const d = new Date(now.getFullYear(), now.getMonth() - 11 + i, 1);
      return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    });
    const newUsers: number[] = Array(12).fill(0);
    let total = 0;
    const totalUsers: number[] = Array(12).fill(0);
    users.forEach((user: any) => {
      const date = new Date(user.createdAt);
      const label = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      const idx = months.indexOf(label);
      if (idx !== -1) {
        newUsers[idx]++;
      }
    });
    newUsers.forEach((n, idx) => {
      total += n;
      totalUsers[idx] = total;
    });
    res.json({
      labels: months,
      datasets: [
        { label: 'New Users', data: newUsers, backgroundColor: '#3b82f6' },
        { label: 'Total Users', data: totalUsers, backgroundColor: '#22c55e' },
      ],
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to get user growth' });
  }
}
