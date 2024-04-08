module.exports = (app) => {
    const token = require("../app/controllers/token.controller.js");
    var router = require("express").Router();

    router.get("/", token.generateAcessToken);

    router.get("/refresh", token.generateAcessTokenByRefreshToken);
    app.use("/api/token", router);
};
