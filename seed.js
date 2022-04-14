const db = require("./models");
var jwt = require("jsonwebtoken");
require("dotenv").config();

async function createSeeds() {
  const hospital = await db.query(
    "insert into hospital(name) values('GMCH') RETURNING *; "
  );
  const token = jwt.sign(
    {
      admin_type: 1,
      hospital_id: 1,
    },
    process.env.SECRET_KEY
  );
  await db.query(
    "insert into admin(admin_type,access_token,hospital_id) values($1,$2,$3); ",
    [1, token, hospital.rows[0].id]
  );
}
createSeeds();
function test() {
  const token = jwt.sign(
    {
      admin_type: 1,
      hospital_id: 1,
    },
    process.env.SECRET_KEY
  );
  console.log(token);
  console.log(jwt.verify(token, process.env.SECRET_KEY));
}
//test();
