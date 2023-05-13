import { Router } from "express";
import { deleteRentals, getRentals, postRentals, postReturn } from "../controllers/rentals.controllers.js";
import { rentalValidation } from "../middlewares/rentalsValidation.js";

const router = Router();

router.get("/rentals", getRentals);
router.post("/rentals", rentalValidation, postRentals);
router.post("/rentals/:id/return", rentalValidation, postReturn);
router.delete("/rentals/:id", deleteRentals);

export default router;