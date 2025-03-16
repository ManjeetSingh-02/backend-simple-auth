import jwt from "jsonwebtoken";

async function isLoggedIn(req, res, next) {
  // check token
  try {
    let token = req.cookies.fullStackSpeedJsAuthToken;
    if (!token) {
      return res.status(401).json({
        message: "Please login",
        success: false,
      });
    }

    // get data from token
    const data = jwt.verify(token, process.env.JWT_SECRET);

    // set data in request as a object
    req.user = data;

    // forware request to other controllers
    next();
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      message: "Error in auth middleware",
      success: false,
    });
  }
}

export default isLoggedIn;
