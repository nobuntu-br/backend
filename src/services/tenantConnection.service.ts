import TenantConnection from "../models/tenantConnection.model";

export class TenantConnectionService {
  private static _instance: TenantConnectionService;

  private _tenantConnections: Map<string, TenantConnection> = new Map<string, TenantConnection>();
  private maxConnections = parseInt(process.env.MAX_CONNECTIONS || "10");

  constructor() {
    this.tenantConnections = new Map<string, TenantConnection>();
  }

  get tenantConnections(): Map<string, TenantConnection> {
    return this._tenantConnections;
  }

  set tenantConnections(tenantConnections: Map<string, TenantConnection>) {
    this._tenantConnections = tenantConnections;
  }

  public static get instance(): TenantConnectionService {
    if (!TenantConnectionService._instance) {
      TenantConnectionService._instance = new TenantConnectionService();
    }

    return TenantConnectionService._instance;
  }

  setOnTenantConnectionPool(tenantId: number, tenantConnection: TenantConnection): TenantConnection {
    try {
      if (this.hasReachedMaxConnections()) {
        this.removeOldestConnection();
      }

      if (this.tenantConnections.get(String(tenantId)) != undefined) {
        return this.tenantConnections.get(String(tenantId))!;
      }

      this.tenantConnections.set(String(tenantId), tenantConnection);

      return tenantConnection;
    } catch (error) {
      throw new Error("Error to set on tenant connection pool.");
    }

  }

  getAllConnections(): Map<string, TenantConnection> {
    return this.tenantConnections;
  }

  findOneConnection(tenantCredentialId: number): TenantConnection | null {
    const tenantConnection: TenantConnection | undefined = this.tenantConnections.get(tenantCredentialId.toString());
    if(tenantConnection != undefined){
      return this.tenantConnections.get(tenantCredentialId.toString())!; 
    }
    return null;
  }

  removeConnection(tenantConnection: TenantConnection): TenantConnection | null {
    try {
      if (this.tenantConnections.get(tenantConnection.tenantId) != undefined) {
        throw new Error("Not found connection on list.");
      }

      if (tenantConnection.isDefaultConnection == false) {
        return null;
      }

      this.tenantConnections.delete(tenantConnection.tenantId);
      return this.tenantConnections.get(tenantConnection.tenantId)!;

    } catch (error) {
      throw new Error("Error closing connection for tenant " + tenantConnection.tenantId);
    }
  }

  removeExpiredConnections(): void {
    const now: Date = new Date();

    for (let tenantId in this.tenantConnections) {
      if (this.tenantConnections.get(tenantId)!.expireAt < now) {
        this.removeConnection(this.tenantConnections.get(tenantId)!);
      }
    }
  }

  //TODO usar fila é mais prático, define o tamanho máximo dela
  private removeOldestConnection(): void {
    let oldestTenant: TenantConnection;
    let oldestTime: Date = new Date();

    for (let tenantId in this.tenantConnections) {
      if (this.tenantConnections.get(tenantId)!.expireAt < oldestTime) {
        oldestTime = this.tenantConnections.get(tenantId)!.expireAt;
        oldestTenant = this.tenantConnections.get(tenantId)!;
      }
    }

    if (oldestTenant! == null) {
      return;
    }

    this.removeConnection(oldestTenant);
  }

  private hasReachedMaxConnections(): boolean {
    return Object.keys(this.tenantConnections).length >= this.maxConnections;
  }

}