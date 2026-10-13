import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { InMemoryTransport } from "@modelcontextprotocol/sdk/inMemory.js";
import { vacationsMcpServer } from "./mcp-server";

class VacationsMcpClient {

    private client: Client | null = null;

    // Connects an MCP Client to our MCP Server in the same process,
    // using linked in-memory transports (no network involved).
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
