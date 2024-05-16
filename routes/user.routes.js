module.exports = app => {
    const user = require("../app/controllers/user.controller.js"); 
    const checkIfDateIsOlder = require("../app/middleware/checkIfDateIsOlder.middleware.js"); 
    const verifyAccess = require("../app/middleware/auth.middleware.js");
    const db = require("../models/index.js"); 
    const User = db.user; 
    const validateUser = require("../app/validators/user.validator.js")

    var router = require("express").Router(); 

    // Create a new user 
    router.post("/", validateUser, user.create); 
    // Retrieve all user 
    router.get("/",verifyAccess.verifyAccess, user.findAll);
    // Retrieve a single user with id 
    router.get("/uid/:uid", user.findOneByUID);
    // Retrieve a single user with id 
    router.get("/:id", verifyAccess.verifyAccess, user.findOne); 
    // Update a user with id 
    router.put("/:id", verifyAccess.verifyAccess, validateUser, checkIfDateIsOlder(User), user.update); 
    // Delete a user with id 
    router.delete("/:id", verifyAccess.verifyAccess, user.delete); 
    // Custom get user 
    router.post("/custom", verifyAccess.verifyAccess, user.findCustom);

    app.use('/api/user', router); 
  }; 
