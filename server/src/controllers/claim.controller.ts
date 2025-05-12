import { Request, Response } from "express";
import { ClaimService } from "../services/claim.service";
import { CreateClaimDto } from "../common/dtos/create-claim.dto";

// Typescript: Extend Express Request type to include user
import { Request as ExpressRequest } from "express";
declare module "express-serve-static-core" {
  interface Request {
    user?: any;
  }
}

// Create a new claim
export async function createClaim(
  req: Request,
  res: Response
): Promise<Response> {
  try {
    const userId = (req.user as any)?.userId;
    if (!userId) {
      return res
        .status(401)
        .json({ message: "Unauthorized: userId not found" });
    }
    const claimData = CreateClaimDto.fromRequestBody(req.body);
    claimData.userId = userId;
    const newClaim = await ClaimService.createClaim(claimData);
    return res.status(201).json(newClaim);
  } catch (error) {
    console.error("Error creating claim:", error);
    return res.status(500).json({ message: "Failed to create claim" });
  }
}

export async function approveClaim(
  req: Request,
  res: Response
): Promise<Response> {
  try {
    const { id } = req.params;
    const updatedClaim = await ClaimService.updateClaimStatus(+id, "Approved");
    if (!updatedClaim) {
      return res.status(404).json({ message: "Claim not found" });
    }
    return res.status(200).json(updatedClaim);
  } catch (error) {
    console.error("Error approving claim:", error);
    return res.status(500).json({ message: "Failed to approve claim" });
  }
}

export async function rejectClaim(
  req: Request,
  res: Response
): Promise<Response> {
  try {
    const { id } = req.params;
    const updatedClaim = await ClaimService.updateClaimStatus(+id, "Rejected");
    if (!updatedClaim) {
      return res.status(404).json({ message: "Claim not found" });
    }
    return res.status(200).json(updatedClaim);
  } catch (error) {
    console.error("Error rejecting claim:", error);
    return res.status(500).json({ message: "Failed to reject claim" });
  }
}

// Get all claims
export async function getAllClaims(
  req: Request,
  res: Response
): Promise<Response> {
  try {
    const claims = await ClaimService.getAllClaims();
    return res.status(200).json(claims);
  } catch (error) {
    console.error("Error fetching claims:", error);
    return res.status(500).json({ message: "Failed to fetch claims" });
  }
}

// Get claims for the currently logged in user
export async function getClaimsByUserId(
  req: Request,
  res: Response
): Promise<Response> {
  try {
    // Assumes verifyToken middleware sets req.user
    const userId = (req.user as any)?.userId;
    if (!userId) {
      return res
        .status(401)
        .json({ message: "Unauthorized: userId not found" });
    }
    const claims = await ClaimService.getUserClaims(userId);
    return res.status(200).json(claims);
  } catch (error) {
    console.error("Error fetching user's claims:", error);
    return res.status(500).json({ message: "Failed to fetch user's claims" });
  }
}

// Get a single claim by ID
export async function getClaimById(
  req: Request,
  res: Response
): Promise<Response> {
  try {
    const { id } = req.params;
    const claim = await ClaimService.getClaimById(+id);
    if (!claim) {
      return res.status(404).json({ message: "Claim not found" });
    }
    return res.status(200).json(claim);
  } catch (error) {
    console.error("Error fetching claim:", error);
    return res.status(500).json({ message: "Failed to fetch claim" });
  }
}

// Delete a claim by ID
export async function deleteClaim(
  req: Request,
  res: Response
): Promise<Response> {
  try {
    const { id } = req.params;
    const deleted = await ClaimService.deleteClaim(+id);
    if (!deleted) {
      return res.status(404).json({ message: "Claim not found" });
    }
    return res.status(204).send();
  } catch (error) {
    console.error("Error deleting claim:", error);
    return res.status(500).json({ message: "Failed to delete claim" });
  }
}
