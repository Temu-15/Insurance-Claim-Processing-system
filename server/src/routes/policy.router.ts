import { Router } from "express";
import {
  createPolicy,
  getAllPolicies,
  getPolicyById,
  approvePolicy,
  rejectPolicy,
  deletePolicy,
  getPolicyByPolicyNumber,
  getUserPolicies,
} from "../controllers/policy.controller";
import { verifyToken } from "../middleware/auth.middleware";

export const policyRouter = Router();

policyRouter.get("/my", verifyToken, getUserPolicies);
policyRouter.post("/", verifyToken, createPolicy);
policyRouter.get("/", getAllPolicies);
policyRouter.get("/:id", getPolicyById);
policyRouter.put("/:id/approve", approvePolicy);
policyRouter.put("/:id/reject", rejectPolicy);
policyRouter.delete("/:id", deletePolicy);
policyRouter.get("/policyNumber/:policyNumber", getPolicyByPolicyNumber);
