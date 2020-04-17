import dotenv from "dotenv";
import multer from "multer";
import multerS3 from "multer-s3";
import aws from "aws-sdk";
import routes from "./routes";

dotenv.config();

const s3 = new aws.S3({
  accessKeyId: process.env.AWS_KEY,
  secretAccessKey: process.env.AWS_PRIVATE_KEY,
  region: "us-east-2",
});

// const multerVideo = multer({ dest: "uploads/videos/" });
const multerVideo = multer({
  storage: multerS3({
    s3,
    acl: "public-read",
    bucket: "m-tube/videos",
  }),
});
// const multerAvatar = multer({ dest: "uploads/avatars/" });
const multerAvatar = multer({
  storage: multerS3({
    s3,
    acl: "public-read",
    bucket: "m-tube/avatars",
  }),
});

export const localsMiddleware = (req, res, next) => {
  res.locals.siteName = "mTube";
  res.locals.routes = routes;
  res.locals.loggedUser = req.user || null;
  // console.log(req.user);
  next();
};

export const onlyPublic = (req, res, next) => {
  if (req.user) {
    res.redirect(routes.home);
  } else {
    next();
  }
};

export const onlyPrivate = (req, res, next) => {
  if (req.user) {
    next();
  } else {
    res.redirect(routes.home);
  }
};

export const uploadVideo = multerVideo.single("videoFile");
export const uploadAvatar = multerAvatar.single("avatar");
