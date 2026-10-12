import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { InMemoryTransport } from "@modelcontextprotocol/sdk/inMemory.js";
import { vacationsMcpServer } from "./mcp-server";

class VacationsMcpClient {

    private client: Client | null = null;

    // Connects an MCP Client directly to our MCP Server, in the same process,
    // using a pair of linked in-memory transports. No network / public URL
    // is involved - the real MCP protocol still runs "under the hood".
    public async getClient(): Promise<Client> {
        if (this.client) return this.client;

        const mcpServer = vacationsMcpServer.create();
        const [clientTransport, serverTransport] = InMemoryTransport.createLinkedPair();

        const client = new Client({ name: "vacations-agent-client", version: "1.0.0" });

        await mcpServer.connect(serverTransport);
        await client.connect(clientTransport);

        this.client = client;
        return client;
    }

}

export const vacationsMcpClient = new VacationsMcpClient();
