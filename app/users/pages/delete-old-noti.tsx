import { makeSSRClient } from "~/supa-client";
import { deleteOldNotifications } from "../queries";
import type { Route } from "./+types/delete-old-noti";

export const action = async ({ request }: Route.ActionArgs) => {
    if (request.method !== "POST") {
        return new Response(null, { status: 404 });
    }
    const { client } = makeSSRClient(request);
    await deleteOldNotifications(client);
    return new Response(null, {status: 200});
}