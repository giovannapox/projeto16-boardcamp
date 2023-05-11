import { Router } from "express";
import { getCustomers, getCustomersById, postCustomers, updateCustomers } from "../controllers/customers.controllers.js";
import { customerValidation } from "../middlewares/customersValidation.js";

const router = Router();

router.get("/customers", getCustomers);
router.get("/customers/:id", getCustomersById);
router.post("/customers", customerValidation, postCustomers);
router.put("/customers/:id", customerValidation, updateCustomers);


export default router;