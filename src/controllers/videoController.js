import routes from "../routes";
import Video from "../models/Video";
import Comment from "../models/Comment";

export const home = async (req, res) => {
  try {
    const videos = await Video.find({}).sort({ _id: -1 });
    //  videos를 array로 넘겨줌
    //  await가 끝이 나야(꼭 성공해야 하는 것이 아니라) render를 실행함
    res.render("home", { pagetitle: "Home", videos });
  } catch (error) {
    console.log(error);
    res.render("home", { pagetitle: "Home", videos: [] });
  }
};

export const search = async (req, res) => {
  // console.log(req.query.term);
  const {
    query: { term: searchingBy },
  } = req;
  let videos = [];
  try {
    videos = await Video.find({
      title: { $regex: searchingBy, $options: "i" },
    }).sort({ _id: -1 });
  } catch (error) {
    console.log("error", error);
  }
  res.render(`search`, { pagetitle: "Search", searchingBy, videos });
};
// export const videos = (req, res) =>
//   res.render(`videos`, { pagetitle: "Videos" });
export const getUpload = (req, res) =>
  res.render(`upload`, { pagetitle: "Upload" });

export const postUpload = async (req, res) => {
  const {
    body: { title, description },
    file: { location },
  } = req;
  console.log(req.file);
  const newVideo = await Video.create({
    fileUrl: location,
    title,
    description,
    creator: req.user.id,
  });
  // console.log(newVideo);
  req.user.videos.push(newVideo.id);
  req.user.save();
  res.redirect(routes.videoDetail(newVideo.id));
};

export const videoDetail = async (req, res) => {
  // console.log("req.params", req.params);
  const {
    params: { id },
  } = req;
  try {
    const video = await Video.findById(id)
      .populate("creator")
      .populate("comments");
    // console.log(video);
    res.render(`videoDetail`, { pagetitle: video.title, video });
  } catch (error) {
    console.log("error", error);
    res.redirect(routes.home);
  }
};

export const getEditVideo = async (req, res) => {
  const {
    params: { id },
  } = req;
  try {
    const video = await Video.findById(id);
    // console.log(String(video.creator), req.user.id);
    if (String(video.creator) !== req.user.id) {
      throw Error();
    } else {
      res.render("editVideo", { pageTitle: `Edit ${video.title}`, video });
    }
  } catch (error) {
    console.log("error", error);
    res.redirect(routes.home);
  }
};
export const postEditVideo = async (req, res) => {
  const {
    params: { id },
    body: { title, description },
  } = req;
  try {
    await Video.findOneAndUpdate(
      {
        _id: id,
      },
      { title, description }
    );
    res.redirect(routes.videoDetail(id));
  } catch (error) {
    console.log("error", error);
    res.redirect(routes.home);
  }
};

export const deleteVideo = async (req, res) => {
  const {
    params: { id },
  } = req;
  try {
    const video = await Video.findById(id);
    if (String(video.creator) !== req.user.id) {
      throw Error();
    } else {
      await Video.findOneAndRemove({ _id: id });
    }
  } catch (error) {
    console.log("error", error);
  }
  res.redirect(routes.home);
};

// Register Video View

export const postRegisterView = async (req, res) => {
  const {
    params: { id },
  } = req;
  try {
    const video = await Video.findById(id);
    video.views += 1;
    video.save();
    res.status(200);
    res.render("videoDetail", { pageTitle: "videoDetail", video });
  } catch (error) {
    res.status(400);
  } finally {
    res.end();
  }
};

// Add Comment

export const postAddComment = async (req, res) => {
  const {
    params: { id },
    body: { comment },
    user,
  } = req;
  try {
    const video = await Video.findById(id);
    const newComment = await Comment.create({
      text: comment,
      creator: user.id,
      author: user.name,
      avatarUrl: user.avatarUrl,
    });
    video.comments.push(newComment.id);
    video.save();
  } catch (error) {
    res.status(400);
  } finally {
    res.end();
  }
};

export const postDelComment = async (req, res) => {
  const {
    params: { id },
  } = req;
  console.log(id);
  try {
    const comment = await Comment.findById(id);
    comment.remove();
  } catch (error) {
    console.log(error);
  } finally {
    res.end();
  }
};
