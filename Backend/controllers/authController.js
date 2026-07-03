const user = require("../models/user");
const {createTokenForUser} = require("../Services/Authentication")
const dotenv = require("dotenv")
dotenv.config()
const FRONTEND_URL = process.env.FRONTEND_URL;
async function handleUserSignUp(req, res) {
  console.log("Request to sign up received!!");

  if (!req.body || !req.body.name || !req.body.email || !req.body.password) {
    console.log({
      msg: "failed",
      error: "Field missing or incorrect in signup form.",
    });

    return res
      .status(400)
      .json({
        msg: "failed",
        error: "Field missing or incorrect in signup form.",
      });
  }

  const { name, email, password } = req.body;

  try {
    const existingUser = await user.findOne({ email: email });

    if (existingUser) {
      return res
        .status(400)
        .json({ msg: "failed", error: "Email already registered." });
    }

    // Create new User
    const created = await user.create({
      name,
      email,
      password,
    });

    if (!created) {
      console.log({ msg: "failed", error: "Error while creating user." });
      return res
        .status(500)
        .json({ msg: "failed", error: "Error while creating user." });
    }
    console.log(created);

    console.log("User signed up successfully!!");
    return res.status(201).json({ msg: "success" });
  } catch (error) {
    console.error("Error in signup:", error);
    return res.status(500).json({ msg: "failed", error: "Server error." });
  }
}

async function handleUserLogout(req, res) {
  try {
    const isProduction = process.env.NODE_ENV === 'production';
    
    res.clearCookie("token", {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? "None" : "Lax",
    });
    console.log("User logged out successfully");

    return res.status(200).json({ msg: "success" });
  } catch (error) {
    console.error("Error during logout:", error);
    return res.status(500).json({ msg: "failed", error: "Server error." });
  }
}

const handleUserLogin = async (req, res) => {
  console.log("Coming..............")
  if (!req.body || !req.body.email || !req.body.password) {
    return res.status(400).json({ msg: "Invalid fields Entered!!!" });
  }

  console.log("Request for login received....")

  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(404).json({ msg: "Invalid fields Entered!!!" });
  }

  const User = await user.matchedUserAndGenerateToken(email, password);
  console.log(User);

  if (User.error) {
    return res.status(500).json({ error: "Sign In failed!!" });
  }

  console.log("Token of user: ", User.token);
  const token = User.token;
  // For Render deployment, force secure cookies
  const isSecure = req.secure || req.get('x-forwarded-proto') === 'https';
  
  const isProduction = process.env.NODE_ENV === 'production';
  console.log("isProd : ",isProduction)
  console.log("isSecure : ",isSecure)
  return res
    .status(200)
    .cookie("token", token, {
      httpOnly: true,
      secure: isSecure,
      sameSite: isProduction ? "None" : "Lax",
      maxAge: 24 * 60 * 60 * 1000,
      // domain : "scam-radar.vercel.app",
      path : "/",
    })
    .json({ msg: "Sign In succedded", user: User });
};


async function handleSignUpUserViaGoogleAuth(req, res) {
  try {
    const user = req.user; // Comes from Passport Google OAuth strategy

    if (!user) {
      return res.redirect(`${FRONTEND_URL}/login?error=oauth_failed`);
    }

    const token = createTokenForUser(user);
   const isSecure = req.secure || req.get('x-forwarded-proto') === 'https';
  
    const isProduction = process.env.NODE_ENV === 'production';
    console.log("isProd : ",isProduction)
    console.log("isSecure : ",isSecure)
    
    // Set the token as an httpOnly cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: isSecure,
      sameSite: isProduction ? "None" : "Lax",
      maxAge: 24 * 60 * 60 * 1000,
      // domain : "scam-radar.vercel.app",
      path : "/",
    });

    // Redirect to frontend dashboard or callback page
    return res.redirect(`${FRONTEND_URL}/dashboard`);
  } catch (err) {
    console.error("OAuth signup error:", err);
    return res.redirect(`${FRONTEND_URL}/login?error=oauth_failed`);
  }
}


module.exports = {
  handleUserSignUp,
  handleUserLogout,
  handleUserLogin,
  handleSignUpUserViaGoogleAuth
};
