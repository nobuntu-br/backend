module.exports = app => {
    const session = require("../app/controllers/session.controller.js"); 
    const checkIfDateIsOlder = require("../app/middlewares/checkIfDateIsOlder.middleware.js"); 
    const verifyAccess = require("../app/middlewares/auth.middleware.js");
    const db = require("../models/index.js"); 
    const Session = db.session; 

    var router = require("express").Router(); 

    // Create a new Session 
    router.post("/", session.create); 
    // Retrieve all session 
    router.get("/",verifyAccess.verifyAccess, session.findAll); 
    // Retrieve a single Session with id 
    router.get("/:id", verifyAccess.verifyAccess, session.findOne); 
    // Update a Session with id 
    router.put("/:id", verifyAccess.verifyAccess, checkIfDateIsOlder(Session), session.update); 
    // Delete a Session with id 
    router.delete("/:id", verifyAccess.verifyAccess, session.delete); 
    // Custom get Session 
    router.post("/custom",verifyAccess.verifyAccess, session.findCustom);

    app.use('/api/session', router); 
  }; 
