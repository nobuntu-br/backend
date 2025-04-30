import { createDbAdapter } from "../../../infra/database/createDb.adapter";
import { IDatabaseAdapter } from "../../../infra/database/IDatabase.adapter";
import { IMenuDatabaseModel, Menu } from "../../entities/fixes/menuConfig";
import TenantConnection from "../../entities/fixes/tenantConnection.model";
import BaseRepository from "./base.repository";
import { where } from "sequelize";

export default class MenuRepository extends BaseRepository<IMenuDatabaseModel, Menu>{ 

  constructor(tenantConnection: TenantConnection) { 
    const _adapter : IDatabaseAdapter<IMenuDatabaseModel, Menu> = createDbAdapter<IMenuDatabaseModel, Menu>(tenantConnection.models!.get("nfMenu"), tenantConnection.databaseType, tenantConnection.connection, Menu.fromJson);
    super(_adapter, tenantConnection); 
  } 

  async getAllMenus(): Promise<Menu[]> {
    const menus = await this.tenantConnection.models!.get("nfMenu").findAll({
      include: [
        {
          model: this.tenantConnection.models!.get("nfMenuItem"),
          as: "menuItems", // deve ser exatamente o mesmo alias definido na associação
        },
        {
          model: this.tenantConnection.models!.get("nfMenuConfig"),
          as: "menuConfig" // caso a associação use esse alias
        }
      ]
    });
    
    menus.forEach((menu: any) => {
      menu.dataValues.itens = this.construirSubMenu(menu.dataValues.menuItems, null);
      menu.dataValues.config = menu.dataValues.menuConfig;
    });

    return menus;
  }

  async joinMenuWithItensAndConfig(): Promise<Menu[]>{
    const menus = await this.tenantConnection.models!.get("nfMenu").findAll();
    const menuItens = await this.tenantConnection.models!.get("nfMenuItem").findAll();
    const menuConfigs = await this.tenantConnection.models!.get("nfMenuConfig").findAll();

    const itensComSubMenu = this.construirSubMenu(menuItens, null);

    const menusComConfig = menus.map((menu: any) => ({
      ...menu.dataValues,
      config: menuConfigs.find((config: any) => config.dataValues.id === menu.dataValues.menuConfigId)?.dataValues || null,
      itens: itensComSubMenu.filter((item: any) => item.menuId === menu.id)
    }));

    return menusComConfig;
  }

  async getMenuByRole(roleId: number): Promise<Menu[]>{
    const roleMenus = await this.tenantConnection.models!.get("nfRole").findOne({
      where: { id: roleId },
      include: [
        {
          model: this.tenantConnection.models!.get("nfMenu"),
          as: 'menus', // use o alias definido na associação
          through: { attributes: [] } // opcional: para não trazer os atributos da tabela intermediária
          
        },
      ]
    });
    const menus = await roleMenus.dataValues.menus.map(async (menu: any) => ({
      ...(await this.getMenuById(menu.id))?.[0], // chama o método getMenuById para cada menu
      fileName: menu.dataValues.fileName, // adiciona o fileName do menu
      id: menu.dataValues.id, // adiciona o id do menu
      roleName: roleMenus.dataValues.name // adiciona o nome da role relacionada ao menu
    }));

    return await Promise.all(menus) as Menu[];

  } 

  async getMenuById(menuId: number): Promise<Menu[] | null> {
    let menu = await this.tenantConnection.models!.get("nfMenu").findOne({
      where: { id: menuId },
      include: [
        {
          model: this.tenantConnection.models!.get("nfMenuItem"),
          as: "menuItems", // deve ser exatamente o mesmo alias definido na associação
        },
        {
          model: this.tenantConnection.models!.get("nfMenuConfig"),
          as: "menuConfig" // caso a associação use esse alias
        }
      ]
    });

    menu = {
      itens: this.construirSubMenu(menu.dataValues.menuItems, null),
      config: menu.dataValues.menuConfig,
      ...menu.dataValues,
    }
    
    return [menu];
  }

  async getDefaultMenu(): Promise<Menu[]> {
    let menus = await this.tenantConnection.models!.get("nfMenu").findAll({
      include: [
      {
        model: this.tenantConnection.models!.get("nfMenuItem"),
        as: "menuItems", // deve ser exatamente o mesmo alias definido na associação
      },
      {
        model: this.tenantConnection.models!.get("nfMenuConfig"),
        as: "menuConfig", // caso a associação use esse alias
        required: true, // garante que só trará menus com menuConfig associado
        where: { defaultMenu: true } // filtra apenas os menus cujo menuConfig tenha defaultMenu = true
      }
      ]
    });
    let defaultMenus = menus.map((menu: any) => {
      return {
          ...menu.dataValues,
          itens: this.construirSubMenu(menu.dataValues.menuItems, null),
          config: menu.dataValues.menuConfig
        };
      });

      return defaultMenus;
    };

    

  private construirSubMenu(menuItens: any[], parentId: number | null): any[] {
    return menuItens.filter(item => item.dataValues.subMenuId === parentId).map(item => {
      return {
        ...item.dataValues,
        subMenu: this.construirSubMenu(menuItens, item.id)
      };
    });
  }
}
