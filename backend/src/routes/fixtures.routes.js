import { Router } from "express";
import { FixturesController } from "../controllers/fixtures.controller.js";

const router = Router();

router.get("/calendar", FixturesController.listarCalendario);
router.get("/lineup/:id", FixturesController.obterEscalacao);

export default router;
