const { Client } = require("@yugabytedb/pg");
const { SecretClient } = require("@azure/keyvault-secrets");
const { DefaultAzureCredential } = require("@azure/identity");

async function main() {
  // If you're using MSI, DefaultAzureCredential should "just work".
  // Otherwise, DefaultAzureCredential expects the following three environment variables:
  // - AZURE_TENANT_ID: The tenant ID in Azure Active Directory
  // - AZURE_CLIENT_ID: The application (client) ID registered in the AAD tenant
  // - AZURE_CLIENT_SECRET: The client secret for the registered application
  const credential = new DefaultAzureCredential();

  const keyVaultName = process.env["KEY_VAULT_NAME"];
  if (!keyVaultName) throw new Error("KEY_VAULT_NAME is empty");
  const url = "https://" + keyVaultName + ".vault.azure.net";

  const secretClient = new SecretClient(url, credential);

  const dbhost = await secretClient.getSecret("DBHOST");
  const dbusername = await secretClient.getSecret("DBUSERNAME");
  const dbpassword = await secretClient.getSecret("DBPASSWORD");
  const dbcertificate = await secretClient.getSecret("DBCERTIFICATE");

  // Logging secret objects from Azure Key Vault
  console.log(dbhost, dbpassword, dbusername, dbcertificate);

  const ybclient = new Client({
    database: "yugabyte",
    host: dbhost.value,
    user: dbusername.value,
    port: 5433,
    password: dbpassword.value,
    max: 10,
    idleTimeoutMillis: 0,
    ssl: {
      rejectUnauthorized: true,
      ca: dbcertificate.value,
      servername: dbhost.value,
    },
  });
  console.log("Establishing connection with YugabyteDB Managed...");
  await ybclient.connect();
  console.log("Connected successfully.");
}

main().catch((error) => {
  console.error("An error occurred:", error);
  process.exit(1);
});
