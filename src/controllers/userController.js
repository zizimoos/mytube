import passport from "passport";
import routes from "../routes";
import User from "../models/User";

export const getJoin = (req, res) => {
  res.render("join", { pagetitle: "Join" });
};
export const postJoin = async (req, res, next) => {
  // console.log("what!!!", req.body);
  const {
    body: { name, email, password, vpassword },
  } = req;
  if (password !== vpassword) {
    req.flash("error", "passwords don't match");
    res.status(400);
    res.render("join", { pagetitle: "Join" });
  } else {
    try {
      const user = await User({
        name,
        email,
      });
      await User.register(user, password);
      next();
    } catch (error) {
      console.log("error", error);
      res.redirect(routes.home);
    }
  }
};

export const getLogin = (req, res) =>
  res.render("login", { pagetitle: "Login" });

export const postLogin = passport.authenticate("local", {
  failureRedirect: routes.login,
  successRedirect: routes.home,
  successFlash: "welcome",
  failureFlash: "Can't log in. check email or password",
});

export const record = (req, res) => {
  res.render("record", { pagetitle: "record" });
};

// github

export const githubLogin = passport.authenticate("github", {
  successFlash: "welcome",
  failureFlash: "Can't log in. check email or password",
});
export const githubLoginCallback = async (_, __, profile, cb) => {
  // console.log(profile);
  const {
    _json: { id, avatar_url: avatarUrl, name, email },
  } = profile;
  try {
    const user = await User.findOne({ email });
    // console.log(user);
    if (user) {
      user.githubId = id;
      user.save(user);
      return cb(null, user);
    }
    const newUser = await User.create({
      email,
      name,
      avatarUrl,
      githubId: id,
    });
    // console.log("newUser", newUser);
    return cb(null, newUser);
  } catch (error) {
    return cb(error);
  }
};
export const postGithubLogin = (req, res) => res.redirect(routes.home);

// facebook

export const facebookLogin = passport.authenticate("facebook");
export const facebookLoginCallback = async (_, __, profile, cb) => {
  const {
    _json: { id, name, email },
  } = profile;
  try {
    const user = await User.findOne({ email });
    if (user) {
      user.facebookId = id;
      user.avatarUrl = `https://graph.facebook.com/${id}/picture?type=large`;
      user.save();
      return cb(null, user);
    }
    const newUser = await User.create({
      email,
      name,
      facebookId: id,
      avatarUrl: `https://graph.facebook.com/${id}/picture?type=large`,
    });
    return cb(null, newUser);
  } catch (error) {
    return cb(error);
  }
};
export const postFacebookLogin = (req, res) => {
  res.redirect(routes.home);
};

// google

export const googleLogin = passport.authenticate("google", {
  successFlash: "welcome",
  failureFlash: "Can't log in. check email or password",
});
export const googleLoginCallback = async (_, __, profile, cb) => {
  console.log(profile);
  const {
    _json: { sub: id, picture: avatarUrl, name, email },
  } = profile;
  try {
    const user = await User.findOne({ email });
    if (user) {
      user.googleId = id;
      user.save();
      return cb(null, user);
    }
    const newUser = await User.create({
      email,
      name,
      googleId: id,
      avatarUrl,
    });
    return cb(null, newUser);
  } catch (error) {
    return cb(error);
  }
};
export const postGoogleLogin = (req, res) => {
  res.redirect(routes.home);
};

// kakao

export const kakaoLogin = passport.authenticate("kakao", {
  successFlash: "welcome",
  failureFlash: "Can't log in. check email or password",
});
export const kakaoLoginCallback = async (_, __, profile, cb) => {
  console.log(profile);
  const {
    _json: {
      id,
      properties: { nickname: name, profile_image: avatarUrl },
      kakao_account: { email },
    },
  } = profile;
  try {
    const user = await User.findOne({ email });
    if (user) {
      user.kakaoId = id;
      user.save();
      return cb(null, user);
    }
    const newUser = await User.create({
      email,
      name,
      kakaoId: id,
      avatarUrl,
    });
    return cb(null, newUser);
  } catch (error) {
    return cb(error);
  }
};
export const postKakaoLogin = (req, res) => {
  res.redirect(routes.home);
};

export const logout = (req, res) => {
  // ToDo : precess Log Out
  req.flash("info", "Logged Out");
  req.logout();
  res.redirect(routes.home);
};

export const users = (req, res) => res.render("users", { pagetitle: "Users" });

export const getMe = async (req, res) => {
  // console.log(req.user);
  const {
    user: { id },
  } = req;
  // console.log("getME ==============", id);
  try {
    const user = await User.findById(id).populate("videos");
    console.log("===========", user);
    res.render("profile", { pagetitle: "Profile", user });
  } catch (error) {
    res.redirect(routes.home);
  }
};

export const userDetail = async (req, res) => {
  const {
    params: { id },
  } = req;
  // console.log("userDetail ==============", id);
  try {
    if (!req.user) {
      res.redirect(routes.home);
    } else {
      const user = await User.findById(id).populate("videos");
      const { videos } = user;
      console.log("User ===>", videos);
      res.render("userDetail", {
        pagetitle: "User Detail",
        user,
        videos,
      });
    }
  } catch (error) {
    req.flash("error", "User not found");
    res.redirect(routes.home);
  }
};
export const getEditProfile = (req, res) =>
  res.render("editProfile", { pagetitle: "Edit Profile" });

export const postEditProfile = async (req, res) => {
  const {
    body: { name, email },
    file,
  } = req;
  try {
    await User.findByIdAndUpdate(req.user.id, {
      name,
      email,
      avatarUrl: file ? file.location : req.user.avatarUrl,
    });
    req.flash("success", "Profile updated");
  } catch (error) {
    req.flash("error", "Can't update profiles");
    res.redirect(routes.home);
  }
  res.redirect(routes.home);
  // res.render("editProfile", { pagetitle: "Edit Profile" });
};

export const editProfile = (req, res) =>
  res.render("editProfile", { pagetitle: "Edit Profile" });

export const getChangePassword = (req, res) =>
  res.render("changePassword", { pagetitle: "Change Password" });

export const postChangePassword = async (req, res) => {
  const {
    body: { oldPassword, newPassword, verifyPassword },
  } = req;
  try {
    if (newPassword !== verifyPassword) {
      req.flash("error", "password don't match");
      res.status(400);
      res.redirect(routes.changePassword);
      return;
    }
    await req.user.changePassword(oldPassword, newPassword);
    res.redirect(routes.me);
  } catch (error) {
    req.flash("error", "Can't change password");
    res.status(400);
    res.redirect(routes.editProfile);
  }
};
