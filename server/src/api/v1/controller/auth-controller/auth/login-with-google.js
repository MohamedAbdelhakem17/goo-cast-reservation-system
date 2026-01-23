const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const userModel = require("../../../models/user-model/user-model");
const AppError = require("../../../utils/app-error");

passport.use(
    // 1 Google  Credentials
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_REDIRECT_URI,
    },
    // 2 CallBake Function
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile?.emails?.[0]?.value;

        if (!email) {
          console.warn("Google login failed: No email found in profile.");
          return done(null, false, new AppError(400, "No email found in profile"));
        }

        // Check if user already exists
        let user = await userModel.findOne({
          email,
        });

        if (user) {
          if(!user.google) {
            user.google = profile.id;
            await user.save();
          }
          
          return done(null, user);
        }

        // Create new user
        user = await userModel.create({
          name: profile.displayName,
          email,
          google: profile.id,
          active: true,
        });


        return done(null, user);
      } catch (err) {
        console.error("Google login error:", {
          message: err.message,
          stack: err.stack,
          googleId: profile?.id,
          emailTried: profile?.emails?.[0]?.value,
        });

        return done(null, false, new AppError(500, "Failed to login with Google"));
      }
    }
  )
);

// Serialize user ID into session
passport.serializeUser((user, done) => {
  done(null, user._id);
});

// Deserialize user from session
passport.deserializeUser(async (id, done) => {
  try {
    const user = await userModel.findById(id);
    if (!user) {
      return done(null, false, { message: "User not found in the system." });
    }
    done(null, user);
  } catch (err) {
    console.error("Session restore error:", err);
    done(null, false, {
      message: "Could not restore your session. Please log in again.",
    });
  }
});