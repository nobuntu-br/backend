module.exports = app => {
    const session = require("../app/controllers/session.controller.js"); 
    const checkIfDateIsOlder = require("./../app/middleware/checkIfDateIsOlder.middleware.js");
    const verifyAccess = require("./../app/middleware/auth.middleware.js");
    const db = require("../models/index.js"); 
    const Session = db.session; 
    const validateSession = require("../app/validators/session.validator.js");
    var router = require("express").Router(); 

    // Create a new Session 
    router.post("/", validateSession, session.create); 
    // Retrieve all session 
    router.get("/",verifyAccess.verifyAccess, session.findAll); 
    // Retrieve a single Session with id 
    router.get("/:id", verifyAccess.verifyAccess, session.findOne); 
    // Update a Session with id 
    router.put("/:id", verifyAccess.verifyAccess, validateSession, checkIfDateIsOlder(Session), session.update); 
    // Delete a Session with id 
    router.delete("/:id", verifyAccess.verifyAccess, session.delete); 
    // Custom get Session 
    router.post("/custom",verifyAccess.verifyAccess, session.findCustom);

    app.use('/api/session', router); 
  }; 
