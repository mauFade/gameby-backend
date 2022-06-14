import { Router } from "express";

// Import middlewares
import auth from "./services/authentication";

// Import controllers
import AuthInstant from "./controllers/AuthController";
import UserInstant from "./controllers/UserController";
import PostInstant from "./controllers/PostController";
import ProfileInstant from "./controllers/ProfileController";

const router = Router();

router.post("/login", AuthInstant.create);

router.post("/users", UserInstant.create);
router.get("/users", auth.verifyJWT, UserInstant.read);
router.put("/users", auth.verifyJWT, UserInstant.update);
router.delete("/users", auth.verifyJWT, UserInstant.delete);

router.post("/post", auth.verifyJWT, PostInstant.create);
router.get("/post", auth.verifyJWT, PostInstant.read);
router.put("/post", auth.verifyJWT, PostInstant.update);
router.delete("/post", auth.verifyJWT, PostInstant.delete);

router.post("/profile", auth.verifyJWT, ProfileInstant.create);
router.get("/profile", auth.verifyJWT, ProfileInstant.read);
router.put("/profile", auth.verifyJWT, ProfileInstant.update);
router.delete("/profile", auth.verifyJWT, ProfileInstant.delete);

export default router;
