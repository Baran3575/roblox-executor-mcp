import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { describeResponse, sendAndWait } from "../../factory.js";
import { maxOutputCharsSchema } from "../../schemas.js";

export default function register(server: McpServer): void {
  server.registerTool(
    "get-instance-properties",
    {
      title: "Get properties and attributes of a Roblox Instance",
      description:
        "Retrieve a dictionary of all properties and custom attributes of a Roblox Instance using reflection or fallback definitions. E.g. properties of parts, players, or GUI elements.",
      inputSchema: z.object({
        root: z
          .string()
          .describe(
            "The instance path to inspect (e.g., 'game.Workspace.Baseplate', 'game.Players.LocalPlayer.Character.Humanoid')"
          ),
        maxOutputChars: maxOutputCharsSchema,
      }),
    },
    async ({ root, maxOutputChars }) =>
      sendAndWait({
        type: "get-instance-properties",
        data: { root },
        maxOutputChars,
        stampClient: true,
        truncationHint: "Rerun get-instance-properties with a more specific target instance path.",
        failureMessage: (response) =>
          "Failed to get instance properties: " + describeResponse(response),
      })
  );
}
