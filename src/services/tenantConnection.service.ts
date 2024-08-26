import TenantConnection from "../models/tenantConnection.model";

export class TenantConnectionService {

  private tenantConnections: { [key: string]: TenantConnection } = {};
  private maxConnections = parseInt(process.env.MAX_CONNECTIONS || "10");


  setOnTenantConnectionPool(tenantId: string, tenantConnection: TenantConnection): TenantConnection | null {
    try {
      if (this.hasReachedMaxConnections()) {
        this.removeOldestConnection();
      }
  
      if (this.tenantConnections[tenantId]) {
        return this.tenantConnections[tenantId];
      }
      
      this.tenantConnections[tenantId] = tenantConnection;
      return tenantConnection;
    } catch (error) {
      console.log(`Error creating connection for tenant ${tenantId}`);
      return null;
    }

  }

  findAllConnections(): { [key: string]: TenantConnection } {
    return this.tenantConnections;
  }

  findOneConnection(tenantCredentialId: string): TenantConnection {
    return this.tenantConnections[tenantCredentialId];
  }

  removeConnection(tenantConnections: TenantConnection): TenantConnection | null {
    try {
      if(tenantConnections.isDefaultConnection == false){
        return null;
      }

      delete this.tenantConnections[tenantConnections.tenantId];
      return this.tenantConnections[tenantConnections.tenantId];
    } catch (error) {
      console.log(`Error closing connection for tenant ${tenantConnections.tenantId}`);
        return null;
    }
  }

  removeExpiredConnections(): void {
    const now: Date = new Date();

    for (let tenantId in this.tenantConnections) {
      if (this.tenantConnections[tenantId].expireAt < now) {
        this.removeConnection(this.tenantConnections[tenantId]);
      }
    }
  }

  private removeOldestConnection(): void {
    let oldestTenant!: TenantConnection;
    let oldestTime: Date = new Date();

    for (let tenantId in this.tenantConnections) {
      if (this.tenantConnections[tenantId].expireAt < oldestTime) {
        oldestTime = this.tenantConnections[tenantId].expireAt;
        oldestTenant = this.tenantConnections[tenantId];
      }
    }

    this.removeConnection(oldestTenant);
  }

  private hasReachedMaxConnections(): boolean {
    return Object.keys(this.tenantConnections).length >= this.maxConnections;
  }

}