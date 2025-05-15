const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const AuthModel = require("../../../models/user-model/user-model");
const AppError = require("../../../utils/app-error");
const { HTTP_STATUS_TEXT } = require("../../../config/system-variables");

// Local Strategy Configuration
passport.use(
  new LocalStrategy(
    {
      usernameField: "email", // use email instead of default username
      passwordField: "password",
    },
    async (email, password, done) => {
      try {
        // 1. Validate input
        if (!email || !password) {
          return done(
            new AppError(400, HTTP_STATUS_TEXT.FAIL, "All fields are required"),
            null
          );
        }

        // 2. Find user by email
        const user = await AuthModel.findOne({ email });
        if (!user) {
          return done(
            new AppError(404, HTTP_STATUS_TEXT.FAIL, "This user was not found"),
            null
          );
        }

        // Optional: Check if user is verified or active
        if (!user.active) {
          return done(
            new AppError(403, HTTP_STATUS_TEXT.FAIL, "Account not verified"),
            null
          );
        }

        // 3. Check if password is correct
        const isPasswordValid = await user.comparePassword(password);
        if (!isPasswordValid) {
          return done(
            new AppError(401, HTTP_STATUS_TEXT.FAIL, "Invalid credentials"),
            null
          );
        }

        // 4. Authentication successful
        const { email:userEmail, name, phone, role  , _id} = user._doc;
        return done(null, { email: userEmail, name, phone, _id , role });
      } catch (err) {
        console.error("Local login error:", {
          message: err.message,
          stack: err.stack,
          emailTried: email,
        });

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

// Serialize user ID to store in session
passport.serializeUser((user, done) => {
  console.log("Local serializeUser:", user);
  done(null, user._id);
});

// Deserialize user from session
passport.deserializeUser(async (id, done) => {
  try {
    const user = await AuthModel.findById(id);
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
    console.error("Session restore error:", err);
    done(
      new AppError(
        500,
        HTTP_STATUS_TEXT.FAIL,
        "Could not restore your session. Please log in again."
      ),
      null
    );
  }
});
