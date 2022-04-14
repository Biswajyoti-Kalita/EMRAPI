const { Client } = require("pg");
const schema = require("./schema");
require("dotenv").config();
const client = new Client();

module.exports = {
  connectClient: async () => {
    await client
      .connect()
      .then((success) => {
        console.log("DB connected successfully");
      })
      .catch((err) => {
        console.log("error occured", err);
      });
  },
  query: async function (text, params) {
    try {
      const start = Date.now();
      const res = await client.query(text, params);
      const duration = Date.now() - start;
      console.log("executed query", { text, duration, rows: res.rowCount });
      return res;
    } catch (err) {
      console.log(err);
      return {
        status: "error",
        message: err,
      };
    }
  },
  findOne: async function (table_name, attributes, whereFields, joins) {
    const self = this;
    let fields = "",
      queryString = "",
      where = [];

    try {
      for (let item in attributes) {
        if (fields.length > 1) {
          fields += ",";
        }
        if (joins && joins[0])
          fields += table_name + "." + attributes[item] + " ";
        else fields += attributes[item] + "";
      }

      if (whereFields) {
        for (let item in whereFields) {
          if (queryString.length == 0) queryString = " where ";

          if (where.length > 0) {
            console.log(where.length, where);
            queryString += " and ";
          }
          where.push(whereFields[item]);
          if (joins && joins[0])
            queryString += table_name + "." + item + "=$" + where.length;
          else queryString += item + "=$" + where.length;
        }
      }

      if (joins && joins[0]) {
        joins.map((item) => {
          if (item.table) {
            table_name = item.table + "," + table_name;
          }
          if (item.attributes) {
            fields +=
              "," + item.attributes.map((x) => item.table + "." + x).toString();
          }
          if (item.join_as) {
            if (queryString.length == 0) queryString = " where ";

            if (queryString.length > 8) queryString += " and ";

            queryString += " " + item.join_as + " ";
          }
        });
      }
      console.log(
        `SELECT ${fields} from   ${table_name}   ${queryString} limit 1`
      );
      const checkDataExist = await self.query(
        `SELECT ${fields} from   ${table_name}   ${queryString} limit 1`,
        where
      );
      if (checkDataExist["status"] && checkDataExist["status"] === "error") {
        return checkDataExist;
      }
      return checkDataExist.rows[0] ? checkDataExist.rows[0] : {};
    } catch (err) {
      console.log(err);
      return {
        status: "error",
        message: err,
      };
    }
  },
  findAll: async function (table_name, attributes, whereFields, joins) {
    const self = this;
    let fields = "",
      queryString = "",
      where = [];

    for (let item in attributes) {
      if (fields.length > 1) {
        fields += ",";
      }
      if (joins && joins[0])
        fields += table_name + "." + attributes[item] + " ";
      else fields += attributes[item] + "";
    }
    if (fields.length === 0) fields = " * ";

    if (whereFields) {
      for (let item in whereFields) {
        if (queryString.length == 0) queryString = " where ";

        if (where.length > 0) queryString += " and ";

        if (typeof whereFields[item] === "string")
          where.push("%" + whereFields[item].toString().toLowerCase() + "%");
        else where.push(whereFields[item]);
        if (joins && joins[0]) {
          if (typeof whereFields[item] === "string")
            queryString +=
              "lower(" + table_name + "." + item + ") like $" + where.length;
          else
            queryString += "" + table_name + "." + item + " = $" + where.length;
        } else {
          if (typeof whereFields[item] === "string")
            queryString += "lower(" + item + ") like $" + where.length;
          else queryString += "" + item + " = $" + where.length;
        }
      }
    }

    if (joins && joins[0]) {
      joins.map((item) => {
        if (item.table) {
          table_name = item.table + "," + table_name;
        }
        if (item.attributes) {
          fields +=
            "," + item.attributes.map((x) => item.table + "." + x).toString();
        }
        if (item.join_as) {
          if (queryString.length == 0) queryString = " where ";

          if (queryString.length > 8) queryString += " and ";

          queryString += " " + item.join_as + " ";
        }
      });
    }

    console.log(`SELECT ${fields} from   ${table_name}   ${queryString}`);
    const checkDataExist = await self.query(
      `SELECT ${fields} from   ${table_name}   ${queryString}`,
      where
    );

    if (checkDataExist["status"] && checkDataExist["status"] === "error") {
      return checkDataExist;
    }
    return checkDataExist.rows;
  },
  destroy: async function (table_name, whereFields) {
    const self = this;
    let where = [];
    if (whereFields) {
      queryString = " where ";
      for (let item in whereFields) {
        if (where.length > 0) queryString += " and ";

        where.push(whereFields[item]);
        queryString += item + "=$" + where.length;
      }
    }
    console.log("DELETE from " + table_name + " " + queryString, where);
    try {
      const data = await self.query(
        "DELETE from " + table_name + " " + queryString,
        where
      );

      if (data["status"] && data["status"] === "error") {
        return data;
      } else {
        return {
          status: "success",
          message: table_name + " deleted successfully",
        };
      }
    } catch (err) {
      return {
        status: "error",
        message: err,
      };
    }
  },
  create: async function (table_name, data, requiredFields) {
    let queryString = "",
      fields = "",
      where = [];
    const self = this;

    if (requiredFields && requiredFields[0]) {
      queryString = "SELECT id from " + table_name + " where ";
      requiredFields.map((item, ind) => {
        if (where.length > 0) queryString += " and ";

        where.push(data[item]);
        queryString += item + "=$" + where.length;
      });
      console.log("\n\n", queryString, "\n", fields, "\n", where);

      const checkDataExist = await self.query(queryString, where);
      if (checkDataExist["status"] && checkDataExist["status"] === "error") {
        return checkDataExist;
      }

      if (checkDataExist.rows[0]) {
        return {
          status: "error",
          message: table_name + " already exist ",
        };
      }
    }
    queryString = "";
    where = [];
    for (let item in data) {
      console.log(item, data[item], data[item] != null);
      if (data[item] != null) {
        if (where.length > 0) {
          fields += ",";
          queryString += ",";
        }
        fields += item + " ";
        where.push(data[item]);
        queryString += " $" + where.length;
      }
    }
    const res = await self.query(
      `INSERT INTO  ${table_name}(${fields}) values(${queryString}) RETURNING * `,
      where
    );

    if (res["status"] && res["status"] === "error") {
      return res;
    }

    if (res.rowCount) {
      return {
        status: "success",
        message: table_name + " created successfully",
        res,
      };
    } else {
      return {
        status: "error",
        message: "Something went wrong",
      };
    }
  },
  update: async function (table_name, data, whereFields) {
    try {
      let queryString = "",
        where = [],
        whereString = "";
      const self = this;

      if (whereFields) {
        queryString = "SELECT id from " + table_name + " where ";

        for (let item in whereFields) {
          if (whereFields[item] === null) {
            return {
              status: "error",
              message: item + " is required",
            };
          }

          if (where.length > 0) queryString += " and ";

          where.push(whereFields[item]);
          queryString += item + "=$" + where.length;
        }

        const checkDataExist = await self.query(queryString, where);
        if (!checkDataExist.rows[0]) {
          return {
            status: "error",
            message: table_name + " does not exist ",
          };
        }
      }
      queryString = "";
      where = [];

      for (let item in data) {
        if (data[item] != null) {
          if (queryString.length > 0) {
            queryString += ",";
          }
          where.push(data[item]);
          queryString += item + " = $" + where.length;
        }
      }

      if (queryString.length === 0) {
        return {
          status: "error",
          message: "Input is empty",
        };
      }

      if (whereFields) {
        whereString = "";

        for (let item in whereFields) {
          if (whereString.length > 0) whereString += " and ";
          where.push(whereFields[item]);
          whereString += item + "=$" + where.length;
        }
      }
      console.log(
        ` UPDATE ${table_name} SET (${queryString}) where ${whereString} `,
        where
      );
      const res = await self.query(
        ` UPDATE ${table_name} SET ${queryString} where ${whereString} `,
        where
      );

      if (res["status"] && res["status"] === "error") {
        return res;
      }

      if (res.rowCount) {
        return {
          status: "success",
          message: table_name + " updated successfully",
        };
      } else {
        return {
          status: "error",
          message: "Something went wrong",
        };
      }
    } catch (err) {
      console.log(err);
      return {
        status: "error",
        message: err,
      };
    }
  },
  generateSchema: async () => {
    let tables = schema.getSchemaStr();
    try {
      console.log("CREATING TABLES");
      for (let i = 0; i < tables.length; i++) {
        await client.query(tables[i]);
      }
      console.log("DONE");
    } catch (err) {
      console.log("Error occured", err);
    }
  },
};
