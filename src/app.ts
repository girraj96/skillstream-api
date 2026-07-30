import express from "express";
import helmet from "helmet";
import cors from "cors";
import { userRouter } from "./modules/users/user.routes";
import { errorHandler } from "./middlewares/error.middleware";
import { authRouter } from "./modules/auth/auth.routes";
import { requestLogger } from "./middlewares/request-logger.middleware";
import { postRouter } from "./modules/posts/post.routes";
import { commentRouter } from "./modules/comments/comment.routes";
import { likeRouter } from "./modules/likes/like.routes";
import { savePostRouter } from "./modules/saved-posts/saved-post.routes";
import { followRouter } from "./modules/follows/follow.routes";
import { notificationRouter } from "./modules/notifications/notification.routes";
import { feedRouter } from "./modules/feed/feed.routes";
import { postImageRouter } from "./modules/post-images/post-image.routes";
import { uploadRouter } from "./modules/uploads/upload.routes";
import { videoRouter } from "./modules/videos/video.routes";

export function createApp() {
  const app = express();
  app.use(helmet());
  app.use(cors());
  app.use(express.json());
  app.use(requestLogger);

  app.get("/health", (req, res, next) => {
    res.send({
      status: "ok",
      service: "skillstream-api",
    });
  });
  app.use(authRouter);
  app.use(userRouter);
  app.use(postRouter);
  app.use(commentRouter);
  app.use(likeRouter);
  app.use(savePostRouter);
  app.use(followRouter);
  app.use(notificationRouter);
  app.use(feedRouter);
  app.use(postImageRouter);
  app.use(uploadRouter);
  app.use(videoRouter);
  app.use(errorHandler);

  return app;
}
