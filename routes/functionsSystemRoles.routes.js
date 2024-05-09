module.exports = app => {
    const functionsSystemRoles = require("../app/controllers/functionsSystemRoles.controller.js"); 
    const checkIfDateIsOlder = require("../app/middleware/checkIfDateIsOlder.middleware.js"); 

    const db = require("../models/index.js"); 
    const FunctionsSystemRoles = db.functionsSystemRoles; 

    var router = require("express").Router(); 

    // Create a new FunctionsSystemRoles 
    router.post("/", functionsSystemRoles.create); 
    // Retrieve all functionsSystemRoles 
    router.get("/", functionsSystemRoles.findAll); 
    // Retrieve a single FunctionsSystemRoles with id 
    router.get("/:id", functionsSystemRoles.findOne); 
    // Update a FunctionsSystemRoles with id 
    router.put("/:id", checkIfDateIsOlder(FunctionsSystemRoles), functionsSystemRoles.update); 
    // Delete a FunctionsSystemRoles with id 
    router.delete("/:id", functionsSystemRoles.delete); 
    // Custom get FunctionsSystemRoles 
    router.post("/custom", functionsSystemRoles.findCustom);

    app.use('/api/functionsSystemRoles', router); 
  }; 
