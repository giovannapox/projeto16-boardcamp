import { Router } from "express";
import { getGames, postGames } from "../controllers/games.controllers.js";
import { gameValidation } from "../middlewares/gamesValidation.js";

const router = Router();

router.get("/games", getGames);
router.post("/games", gameValidation, postGames);
export default router;