import express from "express";
import routes from "../routes";

import {
  postRegisterView,
  postAddComment,
  postDelComment,
} from "../controllers/videoController";

const apiRouter = express.Router();

// userRouter.get(routes.users, users);
apiRouter.post(routes.registerView, postRegisterView);
apiRouter.post(routes.addComment, postAddComment);
apiRouter.post(routes.delComment, postDelComment);

export default apiRouter;
