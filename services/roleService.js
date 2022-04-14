require("dotenv").config();
var jwt = require("jsonwebtoken");

module.exports = {
  verifyRole: function (role) {
    return function (req, res, next) {
      const token = req.body.token || req.headers["token"];

      if (token) {
        jwt.verify(token, process.env.SECRET_KEY, function (err, decode) {
          console.log(decode);
          if (err || decode.admin_type != role) {
            res.status(403).send({
              status: "error",
              msg: "authentication failed",
            });
          } else {
            if (decode.admin_type === 1)
              req.body["hospital_id"] = decode.hospital_id;
            next();
          }
        });
      } else {
        res.status(401).send({
          msg: "please send the token",
        });
      }
    };
  },
};
