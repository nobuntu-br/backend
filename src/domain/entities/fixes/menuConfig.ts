import { BaseResourceModel } from "./baseResource.model"
import { MenuConfig } from "./menuConfig.model";
import { MenuItem } from "./menuItem.model";

export interface IMenuDatabaseModel extends BaseResourceModel {
    fileName?: string,
    menuConfigId?: number,
}

export interface IMenu extends BaseResourceModel {
    fileName?: string,
    config?: MenuConfig,
    itens?: MenuItem[],
}

export class Menu extends BaseResourceModel implements IMenu {
    fileName?: string;
    config?: MenuConfig;
    itens?: MenuItem[];

    constructor(input: IMenu){
        super();
        this.id = input.id;
        this.fileName = input.fileName;
        this.config = input.config;
        this.itens = input.itens;
    }

    static fromJson(jsonData: any): Menu {
        return new Menu(jsonData);
    }
}