const express = require("express");
const cors = require("cors");
const app = express();
require('dotenv').config();//adicionado
const mongoose = require('mongoose');
const registerRoutes = require("./app/utils/registerRoutes.util");
const moment = require('moment-timezone');

var corsOptions = { 
  origin: process.env.CORS_ORIGIN 
}; 

app.use(cors(corsOptions)); 
// parse requests of content-type - application/json
app.use(express.json());
// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));
mongoose.connect(process.env.DATABASE_URL);

require("./routes/session.routes")(app);

require("./routes/user.routes")(app);

require("./routes/functionsSystemRoles.routes")(app); 

require("./routes/functionsSystem.routes")(app);  
//Declara Customers rotas
require("./routes/customers.routes")(app); 

//Declara Employees rotas
require("./routes/employees.routes")(app); 

//Declara InventoryTransactionTypes rotas
require("./routes/inventoryTransactionTypes.routes")(app); 

//Declara InventoryTransactions rotas
require("./routes/inventoryTransactions.routes")(app); 

//Declara Invoices rotas
require("./routes/invoices.routes")(app); 

//Declara OrderDetails rotas
require("./routes/orderDetails.routes")(app); 

//Declara OrderDetailsStatus rotas
require("./routes/orderDetailsStatus.routes")(app); 

//Declara Orders rotas
require("./routes/orders.routes")(app); 

//Declara OrdersStatus rotas
require("./routes/ordersStatus.routes")(app); 

//Declara OrdersTaxStatus rotas
require("./routes/ordersTaxStatus.routes")(app); 

//Declara SalesReports rotas
require("./routes/salesReports.routes")(app); 

//Declara Shippers rotas
require("./routes/shippers.routes")(app); 

//Declara Products rotas
require("./routes/products.routes")(app); 

//Declara PurchaseOrderDetails rotas
require("./routes/purchaseOrderDetails.routes")(app); 

//Declara PurchaseOrderStatus rotas
require("./routes/purchaseOrderStatus.routes")(app); 

//Declara PurchaseOrders rotas
require("./routes/purchaseOrders.routes")(app); 

//Declara Suppliers rotas
require("./routes/suppliers.routes")(app); 

//Declara Strings rotas
require("./routes/strings.routes")(app); 

//Declara Company rotas
require("./routes/company.routes")(app); 

//Declara Application rotas
require("./routes/application.routes")(app); 

//Declara CompanyApplicationToken rotas
require("./routes/companyApplicationToken.routes")(app); 

//Declara Devices rotas
require("./routes/devices.routes")(app); 

//Declara Session rotas
require("./routes/session.routes")(app); 

//Declara Users rotas
require("./routes/users.routes")(app); 

//Declara Roles rotas
require("./routes/roles.routes")(app); 

//Declara FunctionsSystem rotas
require("./routes/functionsSystem.routes")(app); 

//Declara FunctionsSystemRoles rotas
require("./routes/functionsSystemRoles.routes")(app); 

//Declara Token Rotas
require("./routes/token.routes")(app);
// Obtém a hora atual e o fuso horário da máquina
const now = moment();
const timezone = moment.tz.guess();
const currentTime = now.tz(timezone).format('YYYY-MM-DD HH:mm:ss');
const currentTimeZone = now.tz(timezone).format('Z');
// set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Servidor está operando na porta ${PORT}.`);
  console.log(`Horário atual: ${currentTime}`);
  console.log(`Fuso horário: ${timezone} (UTC${currentTimeZone})`);

  registerRoutes.saveFunctionsSystem(); 
});
