import { Router } from "express";
import {
  getClaimTrends,
  getClaimStatusBreakdown,
  getUserGrowth
} from "../controllers/analytics.controller";

const analyticsRouter = Router();

analyticsRouter.get("/claim-trends", getClaimTrends);
analyticsRouter.get("/claim-status-breakdown", getClaimStatusBreakdown);
analyticsRouter.get("/user-growth", getUserGrowth);

export default analyticsRouter;
