import { Router } from "express";
import {
  createClaim,
  getAllClaims,
  getClaimById,
  approveClaim,
  rejectClaim,
  deleteClaim,
  getClaimsByUserId,
} from "../controllers/claim.controller";
import { verifyToken } from "../middleware/auth.middleware";

const claimRouter = Router();
claimRouter.post("/", verifyToken, createClaim);

claimRouter.get("/", getAllClaims);
claimRouter.get("/my", verifyToken, getClaimsByUserId);

claimRouter.get("/:id", getClaimById);
claimRouter.put("/:id/approve", approveClaim);
claimRouter.put("/:id/reject", rejectClaim);

// claimRouter.put("/:id", updateClaim);

claimRouter.delete("/:id", deleteClaim);

export default claimRouter;
