## Prerequisites

- A [Microsoft Azure](http://azure.microsoft.com) subscription, with a resource group and storage account
- Access to the [Azure Functions](https://azure.microsoft.com/en-us/products/functions) resource
- [Node.js version](https://github.com/nodejs/release#release-schedule) v18+
- [Azure Functions Core Tools](https://github.com/Azure/azure-functions-core-tools)
- A [YugabyteDB Managed](https://cloud.yugabyte.com/) account

## Example SDK Usage

1. Install the dependencies.

```
% npm install
```

This will install the [YugabyteDB node-postgres Smart Driver](https://docs.yugabyte.com/preview/drivers-orms/nodejs/yugabyte-node-driver/), Azure Key Vault secrets client library and Azure Identity client library, amongst other development dependencies.

2. Set environment variables in the `.env` file.
3. Use the secret client to set the secrets needed to establish a YugabyteDB Managed connection.

```
% node createSecrets.js
```

4. Read these secrets from Azure and connect to YugabyteDB Managed.

```
% node index.js
Establishing connection with YugabyteDB Managed...
Connected successfully.
```
