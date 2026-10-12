import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { mcpTools } from "./mcp-tools";
import z from "zod";

// NOTE on the "as any" casts below: registerTool's generic inference over the
// exact zod shape combined with this project's explicitly-typed tool handler
// signatures caused the TypeScript compiler to report "Type instantiation is
// excessively deep" (a known heavy-generic interaction between zod and this
// SDK's registerTool overloads). The runtime behavior is unaffected - the
// handler still receives exactly the shape declared in inputSchema. This is
// the same "narrowly-scoped, documented cast over a generic union" pattern
// used elsewhere in this project for the Mongoose "Document | Query" case.

class McpRegister {

    public registerGetAllVacationsTool(mcpServer: McpServer): void {
        const uniqueName = "get_all_vacations";
        const config = {
            description: "Get all vacations in the database, including destination, description, dates and price."
        };
        mcpServer.registerTool(uniqueName, config, mcpTools.getAllVacationsTool);
    }

    public registerGetVacationsByStatusTool(mcpServer: McpServer): void {
        const uniqueName = "get_vacations_by_status";
        const config = {
            description: "Get vacations filtered by their date status: 'active' (happening right now), 'future' (not started yet) or 'past' (already ended).",
            inputSchema: { status: z.enum(["active", "future", "past"]) }
        };
        (mcpServer.registerTool as any)(uniqueName, config, mcpTools.getVacationsByStatusTool);
    }

    public registerGetVacationCountTool(mcpServer: McpServer): void {
        const uniqueName = "get_vacation_count";
        const config = {
            description: "Get the count of vacations, optionally filtered by status: 'active', 'future' or 'past'. Omit status to count all vacations.",
            inputSchema: { status: z.enum(["active", "future", "past"]).optional() }
        };
        (mcpServer.registerTool as any)(uniqueName, config, mcpTools.getVacationCountTool);
    }

    public registerGetAveragePriceTool(mcpServer: McpServer): void {
        const uniqueName = "get_average_price";
        const config = {
            description: "Get the average price across all vacations in the database."
        };
        mcpServer.registerTool(uniqueName, config, mcpTools.getAveragePriceTool);
    }

    public registerGetVacationsByCountryTool(mcpServer: McpServer): void {
        const uniqueName = "get_vacations_by_country";
        const config = {
            description: "Get vacations whose destination text mentions a given country or region (e.g. 'Greece', 'Europe' related countries by name).",
            inputSchema: { country: z.string() }
        };
        (mcpServer.registerTool as any)(uniqueName, config, mcpTools.getVacationsByCountryTool);
    }

    public registerGetLikesForDestinationTool(mcpServer: McpServer): void {
        const uniqueName = "get_likes_for_destination";
        const config = {
            description: "Get the number of likes a specific vacation destination has received.",
            inputSchema: { destination: z.string() }
        };
        (mcpServer.registerTool as any)(uniqueName, config, mcpTools.getLikesForDestinationTool);
    }

}

export const mcpRegister = new McpRegister();
