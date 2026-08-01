import {
    Events, ActivityType, PresenceUpdateStatus, REST, Routes,
    type Client, type RESTPutAPIApplicationCommandsJSONBody, type APIApplicationCommand,
} from "discord.js";

const changeInterval = 30;
export default {
    event: Events.ClientReady,

    async execute(client: Client): Promise<void> {
        if (!client.user) {
            console.error("Client user is not ready.");
            return;
        }
        const rest = new REST({ version: "10" }).setToken(client.token ?? "");
        console.log(`🤖 ${client.user.username} (Shard ${client.shard?.ids ?? "N/A"}) is now active!\n⏳ Registering ${client.user.username}'s commands, please wait.`
        );

        try {
            const commandData: RESTPutAPIApplicationCommandsJSONBody = client.commands.map((cmd) => cmd.data.toJSON());

            await rest.put(
                Routes.applicationCommands(client.user.id),
                { body: commandData }
            );

            console.log(`📝 Successfully registered ${client.commands.size} commands for ${client.user.username}!`);
        } catch (error) {
            console.error(`😢 Error registering commands:\n`, error);
        }

        const sleep = (ms: number): Promise<void> => new Promise((resolve) => setTimeout(resolve, ms));
        while (true) {
            const servers = client.guilds.cache.size;
            const activities: { name: string; type: ActivityType }[] = [
                { name: `/help`, type: ActivityType.Watching },
                {
                    name: `${servers} server${servers === 1 ? "" : "s"}`,
                    type: ActivityType.Listening,
                },
            ];
            for (const { name, type } of activities) {
                client.user.setPresence({
                    activities: [{ name, type }],
                    status: PresenceUpdateStatus.Idle,
                });
                await sleep(changeInterval * 1000);
            }
        }
    },
};
