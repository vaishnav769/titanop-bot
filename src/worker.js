import {
  verifyKey,
  InteractionType,
  InteractionResponseType,
} from "discord-interactions";

export default {
  async fetch(request, env) {
    if (request.method !== "POST") {
      return new Response("TitanOp Discord Bot is running!");
    }

    const signature = request.headers.get("x-signature-ed25519");
    const timestamp = request.headers.get("x-signature-timestamp");
    const body = await request.text();

    const isValid = await verifyKey(
      body,
      signature,
      timestamp,
      env.DISCORD_PUBLIC_KEY
    );

    if (!isValid) {
      return new Response("Bad request signature.", { status: 401 });
    }

    const interaction = JSON.parse(body);

    if (interaction.type === InteractionType.PING) {
      return Response.json({ type: InteractionResponseType.PONG });
    }

    if (
      interaction.type === InteractionType.APPLICATION_COMMAND &&
      interaction.data.name === "balance"
    ) {
      return Response.json({
        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        data: {
          content: "🏆 Your balance is 0 points.",
        },
      });
    }

    return new Response("Unknown command");
  },
};
