import TenantConnection from "../domain/entities/tenantConnection.model";
import FunctionSystemRepository from "../domain/repositories/functionSystem.repository";

const fs = require('fs-extra');
const path = require('node:path');

/**
 * Registra todas as rotas dessa API no banco de dados.
 */
export async function saveRoutes(databaseConnection: TenantConnection) {

  let routesData = readRoutes();

  const functionSystemRepository: FunctionSystemRepository = new FunctionSystemRepository(databaseConnection);

  for (let routeIndex = 0; routeIndex < routesData.length; routeIndex++) {
    const _description = getDescription(routesData[routeIndex].fileName, routesData[routeIndex].method, routesData[routeIndex].path);
    const _route = routesData[routeIndex].path;
    const _classname = routesData[routeIndex].fileName;
    const _method = routesData[routeIndex].method[0];

    let route = await functionSystemRepository.findOne({ route: _route, method: _method });

    try {
      if(route == null){
        await functionSystemRepository.create({ description: _description, route: _route, method: _method, className: _classname });
      } else {
        await functionSystemRepository.update(route.id!, { description: _description, route: _route, method: _method, classname: _classname });
      }
    } catch (error: any) {
      throw new Error("Error on create or update functionSystem (routes) on database. Details: "+ error);
    }

  }

  console.log("Salvamento ou atualização de registro de rotas no banco de dados realizado na tabela FunctionSystem");
}

/**
 * Verifica se tem uma descrição personalizada para a rota dentro do arquivo de rota, se não tiver, retorna a descrição padrão.
 * @param {*} className
 * @param {*} method
 * @param {*} path
 * @returns Retorna a descrição da rota
 */
function getDescription(className: string, method: string, routePath: string) {
  var fullPath = path.join(__dirname, `../infra/http/routes/${className}.route.ts`);
  const content = fs.readFileSync(fullPath, 'utf8');

  const RouteDescriptionRegex = /\/\/Description: *([^\n]+)/g;
  const descriptions = content.match(RouteDescriptionRegex) || [];
  const routeDescription = descriptions.find((description: string) => description.includes(method) && description.includes(routePath));

  if (routeDescription) {
    if (routeDescription.includes(method)) {
      if (routeDescription.includes(routePath)) {
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
function getDefaultDescription(className: string, method: string, path: string) {
  if (method == 'get') {
    if (path.includes(':')) {
      return `${className} vizualizar`
    }
    return `${className} listar`;
  }
  if (method == 'post') {
    return `${className} adicionar`;
  }
  if (method == 'put') {
    return `${className} atualizar`;
  }
  if (method == 'delete') {
    if (path.includes(':')) {
      return `${className} excluir`
    } else {
      return `${className} excluir todos`
    }
  }
}

/**
 * Realiza a leitura dos arquivos na pasta de routes e coleta todas as rotas que foram registradas
 * @returns retorna um array com path e method @example [{path: "/api/test/", method: "GET"}]
 */
function readRoutes() {
  var routes: any[] = [];
  // Diretório onde estão localizados os arquivos de rota
  const dir = path.join(__dirname, '../infra/http/routes/');
  //Faz a leitura do diretório que contém as rotas
  const files = fs.readdirSync(dir);

  //Percorre esse diretório
  files.forEach((file: any) => {

    if (file === 'index.ts') {
      return;
    }

    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      // readRoutes(filePath); //Se for um diretório, chama recursivamente

    } else if (path.extname(file) === '.ts') { //Se for um arquivo .js
      const routerFn = require(filePath);

      const app = {
        use: (path: any, router: { stack: any[]; }) => {
          //Percorre cada registro que está armazenado na instância router que fica registrado as rotas
          router.stack.forEach((layer: { route: { methods: {}; path: any; }; }) => {
            //Se for uma rota
            if (layer.route) {
              //Irá obter o nome do método da rota
              const methods = Object.keys(layer.route.methods);
              const _path = path + layer.route.path;
              let fileName = filePath.lastIndexOf('/') > -1 ? filePath.substring(filePath.lastIndexOf('/') + 1, filePath.lastIndexOf('.')) : filePath.substring(filePath.lastIndexOf('\\') + 1, filePath.lastIndexOf('.'));
              fileName = fileName.replace('.route', '');
              routes.push({ path: _path, method: methods, fileName: fileName });
            }
          });
        }
      };

      routerFn.default(app);
    }
  });

  return routes;
}

/**
 * Obtem dados da variável para obter a descrição da rota
 */
function getRouteDescription(filePath: string, descriptionVariableName: string) {
  // Obtem a variável que armazenará as os valores de descrição lendo o arquivo da rota como um txt
  const content = fs.readFileSync(filePath, 'utf8');
  // Por aqui define o nome da variável a ser procurada
  const createRouteDescriptionRegex = /var\s+createRouteDescription\s*=\s*['"]([^'"]+)['"]/;
  const match = content.match(createRouteDescriptionRegex);
  const createRouteDescription = match ? match[1] : 'Nenhuma descrição fornecida';
}