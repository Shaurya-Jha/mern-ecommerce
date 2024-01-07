import { Router } from "express";
import { createUser, loginUser, logoutCurrentUser, getAllUsers } from "../controllers/userController.js";

import { authenticate, authorizeAdmin } from "../middlewares/authMiddleware.js";

const router = Router();

router
.route("/")
.post(createUser)
.get(authenticate, authorizeAdmin, getAllUsers);

router.post('/auth', loginUser);

// for logout feature
router.post('/logout', logoutCurrentUser);

export default router;