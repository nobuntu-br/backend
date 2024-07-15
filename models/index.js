const mongoose = require("mongoose"); 
mongoose.Promise = global.Promise; 
const db = {}; 
db.mongoose = mongoose; 

//Declara Customers
db.customers = require("./customers.model.js")(mongoose); 

//Declara Employees
db.employees = require("./employees.model.js")(mongoose); 

//Declara InventoryTransactionTypes
db.inventoryTransactionTypes = require("./inventoryTransactionTypes.model.js")(mongoose); 

//Declara InventoryTransactions
db.inventoryTransaction = require("./inventoryTransactions.model.js")(mongoose); 

//Declara Invoices
db.invoices = require("./invoices.model.js")(mongoose); 

//Declara OrderDetails
db.orderDetails = require("./orderDetails.model.js")(mongoose); 

//Declara OrderDetailsStatus
db.orderDetailsStatus = require("./orderDetailsStatus.model.js")(mongoose); 

//Declara Orders
db.orders = require("./orders.model.js")(mongoose); 

//Declara OrdersStatus
db.ordersStatus = require("./ordersStatus.model.js")(mongoose); 

//Declara OrdersTaxStatus
db.ordersTaxStatus = require("./ordersTaxStatus.model.js")(mongoose); 

//Declara SalesReports
db.salesReports = require("./salesReports.model.js")(mongoose); 

//Declara Shippers
db.shippers = require("./shippers.model.js")(mongoose); 

//Declara Products
db.products = require("./products.model.js")(mongoose); 

//Declara PurchaseOrderDetails
db.purchaseOrderDetails = require("./purchaseOrderDetails.model.js")(mongoose); 

//Declara PurchaseOrderStatus
db.purchaseOrderStatus = require("./purchaseOrderStatus.model.js")(mongoose); 

//Declara PurchaseOrders
db.purchaseOrders = require("./purchaseOrders.model.js")(mongoose); 

//Declara Suppliers
db.suppliers = require("./suppliers.model.js")(mongoose); 

//Declara Strings
db.strings = require("./strings.model.js")(mongoose); 

//Declara Company
db.company = require("./company.model.js")(mongoose); 

//Declara Application
db.application = require("./application.model.js")(mongoose); 

//Declara CompanyApplicationToken
db.companyApplicationToken = require("./companyApplicationToken.model.js")(mongoose); 

//Declara Devices
db.devices = require("./devices.model.js")(mongoose); 

//Declara Session
db.session = require("./session.model.js")(mongoose); 

//Declara Users
db.user = require("./users.model.js")(mongoose); 

//Declara Roles
db.role = require("./roles.model.js")(mongoose); 

//Declara FunctionsSystem
db.functions_system = require("./functionsSystem.model.js")(mongoose); 

//Declara FunctionsSystemRoles
db.functions_system_roles = require("./functionsSystemRoles.model.js")(mongoose); 

//Declara Users 
//db.user = require("./user.model.js")(mongoose);  

//Declara Roles 
//db.role = require("./role.model.js")(mongoose);  

//Declara FunctionsSystem 
//db.functions_system = require("./functionsSystem.model.js")(mongoose);  

//Declara FunctionsSystemRoles 
//db.functions_system_roles = require("./functionsSystemRoles.model.js")(mongoose);  

//db.session = require("./session.model.js")(mongoose); 

module.exports = db;
