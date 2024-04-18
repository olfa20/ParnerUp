const express = require("express");
const bodyParser = require("body-parser");
const InfluencerRoute = require("./routes/Influencer_route");
const AppOwnerRoute = require("./routes/AppOwner_routes");
const ChatRoute = require("./routes/chat_route");
const passwordResetRoutes = require("./utils/passwordReset");
const HttpError = require("./models/http-error");
const fs = require("fs");
require("dotenv").config();
const mongoose = require("mongoose");
const path = require("path");
const cors = require("cors");
const socketio = require("socket.io");
const PosteRoute = require("./routes/Post_routes");
const generalRoutes = require("./routes/General_Routes");
const offerRoutes = require("./routes/OfferJob_Routes");
const notificationRoute = require("./routes/Notification_routes");
const SocialMediaRoutes = require("./routes/Social-routes");
const CondidatsAcceptedRoutes = require("./routes/Condidat-routes");
const FavorisRoutes = require("./routes/Favoris-routes");
const AbonnementRoutes = require("./routes/Abonnement-routes");
const ProbemRoutes = require("./routes/Problem-routes");
const CommentRoutes = require("./routes/Comment-routes");
const LikeRoutes = require("./routes/Like-routes");
const EventRoutes = require("./routes/Events-routes");
const CategoryRoutes = require("./routes/Category-routes");
const ContentRoutes = require("./routes/Content-routes");
const PublicRoutes = require("./routes/Public-routes");
const AudienceRoutes = require("./routes/AudienceRoutes");
const ReachRoutes = require("./routes/ReachRoutes");
const NoteRoutes = require("./routes/Note-routes");
const CategoryNote = require("./routes/CategoryNote-routes");
const ReviewRoutes = require("./routes/Review-routes");
const AdvancedRoutes = require("./routes/Advanced-routes");
const CollaborationInfluencerRoutes = require("./routes/CollaborationInfluencer-routes");
const RecommandationRoutes = require("./routes/Recommondation-routes");

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use("/uploads/images", express.static(path.join("uploads", "images")));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE");

  next();
});
app.use("/", generalRoutes);
app.use("/influencer", InfluencerRoute);
app.use("/appowner", AppOwnerRoute);
app.use("/password-reset", passwordResetRoutes);
app.use("/chat", ChatRoute);
app.use("/poste", PosteRoute);
app.use("/offer", offerRoutes);
app.use("/social", SocialMediaRoutes);
app.use("/condidat", CondidatsAcceptedRoutes);
app.use("/favoris", FavorisRoutes);
app.use("/abonnement", AbonnementRoutes);
app.use("/problem", ProbemRoutes);
app.use("/notification", notificationRoute);
app.use("/comment", CommentRoutes);
app.use("/like", LikeRoutes);
app.use("/event", EventRoutes);
app.use("/category", CategoryRoutes);
app.use("/content", ContentRoutes);
app.use("/public", PublicRoutes);
app.use("/audience", AudienceRoutes);
app.use("/reach", ReachRoutes);
app.use("/note", NoteRoutes);
app.use("/categorynote", CategoryNote);
app.use("/review", ReviewRoutes);
app.use("/advanced", AdvancedRoutes);
app.use("/collaboration", CollaborationInfluencerRoutes);
app.use("/recommondation", RecommandationRoutes);

app.use((req, res, next) => {
  const error = new HttpError("Could not find this route.", 404);
  throw error;
});
app.use((error, req, res, next) => {
  if (req.file) {
    fs.unlink(req.file.path, (err) => {
      console.log(err);
    });
  }
  if (res.headerSent) {
    return next(error);
  }
  res.status(error.code || 500);
  res.json({ message: error.message || "An unknown error occurred0!" });
});

mongoose
  .connect(process.env.DB)
  .then(() => {
    app.listen(5000);
    console.log("connected!");
  })
  .catch((err) => {
    console.log(err);
  });
