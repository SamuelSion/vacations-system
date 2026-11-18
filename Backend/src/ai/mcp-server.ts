import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { mcpRegister } from "./mcp-register";

// The MCP server: exposes the vacations database to AI agents as a list of ready-to-use tools.
class VacationsMcpServer {

    public create(): McpServer {

        // Create mcp server:
        const mcpServer = new McpServer({
            name: "vacations-mcp-server",
            version: "1.0.0"
        });

        // Register tools:
        mcpRegister.registerGetAllVacationsTool(mcpServer);
        mcpRegister.registerGetVacationsByStatusTool(mcpServer);
        mcpRegister.registerGetVacationCountTool(mcpServer);
        mcpRegister.registerGetAveragePriceTool(mcpServer);
        mcpRegister.registerGetVacationsByCountryTool(mcpServer);
        mcpRegister.registerGetLikesForDestinationTool(mcpServer);

        return mcpServer;
    }

}

export const vacationsMcpServer = new VacationsMcpServer();
