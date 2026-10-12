import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { mcpRegister } from "./mcp-register";

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
