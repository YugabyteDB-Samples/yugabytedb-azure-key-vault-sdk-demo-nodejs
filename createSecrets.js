require("dotenv").config();
const { SecretClient } = require("@azure/keyvault-secrets");
const { DefaultAzureCredential } = require("@azure/identity");

async function main() {
  // As stated by Microsoft, if you're using MSI, DefaultAzureCredential should "just work".
  // Otherwise, DefaultAzureCredential expects the following three environment variables:
  // - AZURE_TENANT_ID: The tenant ID in Azure Active Directory
  // - AZURE_CLIENT_ID: The application (client) ID registered in the AAD tenant
  // - AZURE_CLIENT_SECRET: The client secret for the registered application
  const credential = new DefaultAzureCredential();

  const keyVaultName = process.env["KEY_VAULT_NAME"];
  if (!keyVaultName) throw new Error("KEY_VAULT_NAME is empty");
  const url = "https://" + keyVaultName + ".vault.azure.net";

  const client = new SecretClient(url, credential);

  // Create secrets for YugabyteDB Managed connection
  await client.setSecret("DBUSERNAME", process.env.DB_USERNAME);
  await client.setSecret("DBPASSWORD", process.env.DB_PASSWORD);
  await client.setSecret("DBCERTIFICATE", process.env.DB_CERTIFICATE);
  await client.setSecret("DBHOST", process.env.DB_HOST);

  for await (let secretProperties of client.listPropertiesOfSecrets()) {
    console.log("Secret Name: ", secretProperties.name);

    const secret = await client.getSecret(secretProperties.name);
    console.log("Secret Val:", secret.value);
  }
}

main().catch((error) => {
  console.error("An error occurred:", error);
  process.exit(1);
});
