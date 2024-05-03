const db = require("../../models/index.js");
const Functions_system = db.functions_system;
const fs = require('fs-extra');
const path = require('path');

/**
 * Registra todas as rotas dessa API no banco de dados.
 */
function saveFunctionsSystem() {
  var routesData = readRoutes();
  // console.log(routesData);
  routesData.forEach(async (route) => {
    await saveRoutesOnDatabase(getDescription(route.fileName, route.method, route.path), route.method + "#" + route.path, route.fileName);
  });
}

/**
 * Verifica se tem uma descrição personalizada para a rota dentro do arquivo de rota, se não tiver, retorna a descrição padrão.
 * @param {*} className
 * @param {*} method
 * @param {*} path
 * @returns Retorna a descrição da rota
 */
function getDescription(className, method, routePath) {
  var fullPath = path.join(__dirname, `../../routes/${className}.routes.js`);
  const content = fs.readFileSync(fullPath, 'utf8');
  
  const RouteDescriptionRegex = /\/\/Description: *([^\n]+)/g;
  const descriptions = content.match(RouteDescriptionRegex) || [];
  const routeDescription = descriptions.find(description => description.includes(method) && description.includes(routePath));
  
  if(routeDescription){
    if(routeDescription.includes(method)){
      if(routeDescription.includes(routePath)){
        return routeDescription.match(/"([^']+)"/)[1];
      }
    } else {
      return getDefaultDescription(className, method, routePath);
    }
  } else {
    return getDefaultDescription(className, method, routePath);
  }
  
}

/**
 * Obtem a descrição padrão de uma rota
 * @param {*} className
 * @param {*} method
 * @param {*} path
 * @returns Retorna a descrição padrão de uma rota
 */
function getDefaultDescription(className, method, path) {
  if(method == 'get') {
    if(path.includes(':')) {
      return `${className} vizualizar`
    }
      return `${className} listar`;
  }
  if(method == 'post') {
    return `${className} adicionar`;
  }
  if(method == 'put') {
    return `${className} atualizar`;
  }
  if(method == 'delete') {
    if(path.includes(':')) {
      return `${className} excluir`
    }else {
      return `${className} excluir todos`
    }
  }
}

/**
 * Realiza a leitura dos arquivos na pasta de routes e coleta todas as rotas que foram registradas
 * @returns retorna um array com path e method @example [{path: "/api/test/", method: "GET"}]
 */
function readRoutes() {
  routes = [];
  // Diretório onde estão localizados os arquivos de rota
  const dir = path.join(__dirname, '../../routes');
  //Faz a leitura do diretório que contém as rotas
  const files = fs.readdirSync(dir);

  //Percorre esse diretório
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      readRoutes(filePath); //Se for um diretório, chama recursivamente
    } else if (path.extname(file) === '.js') { //Se for um arquivo .js
      const routerFn = require(filePath);
      
      const app = {
        use: (path, router) => {
          //Percorre cada registro que está armazenado na instância router que fica registrado as rotas
          router.stack.forEach(layer => {
            //Se for uma rota
            if (layer.route) {
              //Irá obter o nome do método da rota
              const methods = Object.keys(layer.route.methods);
              const _path = path + layer.route.path;
              // console.log(`Path: ${_path}, Methods: ${methods}`);
              routes.push({ path: _path, method: methods , fileName: file.split(".")[0]});
            }
          });
        }
      };
      routerFn(app);
    }
  });

  return routes;
}

async function saveRoutesOnDatabase(_description, _route, _classname) {
// console.log(_description,_route,_classname)
  await Functions_system.findOneAndUpdate({ route: _route }, {name: _description, route: _route, classname: _classname}, {
    new: true,
    upsert: true //SE não tiver o registro, ele irá criar
  });

}

/**
 * Obtem o nome dentro do url usado nas rotas.
 * @example "/api/opcional/:id" pegará o "opcional"
 * @param {*} url 
 * @returns Retorna um trecho contido dentro da url.
 */
function getPathName(url) {
  // Divide a URL em partes usando '/' como separador
  const urlParts = url.split('/');

  //Pega a terceira parte. "0/1/2" de "/api/dados"
  return urlParts[2];
}

/**
 * Obtem dados da variável para obter a descrição da rota
 */
function getRouteDescription(filePath, descriptionVariableName){
  // Obtem a variável que armazenará as os valores de descrição lendo o arquivo da rota como um txt
  const content = fs.readFileSync(filePath, 'utf8');
  // Por aqui define o nome da variável a ser procurada
  const createRouteDescriptionRegex = /var\s+createRouteDescription\s*=\s*['"]([^'"]+)['"]/;
  const match = content.match(createRouteDescriptionRegex);
  const createRouteDescription = match ? match[1] : 'Nenhuma descrição fornecida';
}

const registerRoutes = {
  saveFunctionsSystem
};

module.exports = registerRoutes;
