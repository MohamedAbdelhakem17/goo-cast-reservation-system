const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const AuthModel = require("../../../models/user-model/user-model");
const AppError = require("../../../utils/app-error");
const { HTTP_STATUS_TEXT } = require("../../../config/system-variables");

// Local Strategy
passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
    },
    async (email, password, done) => {
      try {
        // 1. Check email/password
        if (!email || !password) {
          return done(
            new AppError(400, HTTP_STATUS_TEXT.FAIL, "All fields are required"),
            null
          );
        }

        // 2. Find user
        const user = await AuthModel.findOne({ email });
        if (!user) {
          return done(
            new AppError(404, HTTP_STATUS_TEXT.FAIL, "User not found"),
            null
          );
        }

        // 3. Check active
        if (!user.active) {
          return done(
            new AppError(403, HTTP_STATUS_TEXT.FAIL, "Account not active"),
            null
          );
        }

        // 4. Compare password
        const isPasswordValid = await user.comparePassword(password);
        if (!isPasswordValid) {
          return done(
            new AppError(401, HTTP_STATUS_TEXT.FAIL, "Invalid credentials"),
            null
          );
        }

        // ✅ Success
        return done(null, user);
      } catch (err) {
        return done(
          new AppError(
            500,
            HTTP_STATUS_TEXT.FAIL,
            "Failed to login with Local"
          ),
          null
        );
      }
    }
  )
);

// Serialize
passport.serializeUser((user, done) => {
  done(null, user._id);
});

// Deserialize
passport.deserializeUser(async (id, done) => {
  try {
    const user = await AuthModel.findById(id);
    console.log("Deserializing user:", user);
    if (!user) {
      return done(
        new AppError(
          404,
          HTTP_STATUS_TEXT.FAIL,
          "User not found in the system."
        ),
        null
      );
    }
    done(null, user);
  } catch (err) {
    done(
      new AppError(
        500,
        HTTP_STATUS_TEXT.FAIL,
        "Could not restore your session."
      ),
      null
    );
  }
});

module.exports = passport;
