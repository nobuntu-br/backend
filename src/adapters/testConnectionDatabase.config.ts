import { connectToDatabase } from "./databaseConnection.config";

export async function testConnectToDatabase(databaseType: string, uri: string, isDefaultConnection: boolean){
  try {
    await connectToDatabase(databaseType, uri, isDefaultConnection);
  } catch (error) {

  }
}