import { IRoleDataBaseModel, Role } from "../../../../domain/entities/fixes/role.model";
import TenantConnection from "../../../../domain/entities/fixes/tenantConnection.model";
import { IRoleRepository } from "../../../../domain/repositories/fixes/role.repository";
import { IDatabaseAdapter } from "../../IDatabase.adapter";

export class RoleRepositorySequelize implements IRoleRepository {
  constructor(private tenantConnection: TenantConnection, private adapter: IDatabaseAdapter<IRoleDataBaseModel, Role>) {}

  async isPublicRoute(method: string, route: string): Promise<boolean> {
    const isPublicRoute = await this.tenantConnection.models!.get("nfFunctionSystem").findAll({
      where: {
        route: route,
        method: method
      },
      include: [
        {
          model: this.tenantConnection.models!.get("nfRole"),
          as: "role",
          required: true,
          where: {
            name: "guest",
          }
        },
      ],
    });

    if (isPublicRoute.length <= 0) {
      return false;
    }

    return true;
  }

}