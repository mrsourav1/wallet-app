"use server"
import { getServerSession } from "next-auth";
import { authOptions } from "../auth";
import prisma from "@repo/db/client";

export async function getWebhookData() {
    try {
        const session = await getServerSession(authOptions);
        const userId = session?.user?.id;

        if (!userId) {
            return {
                message: "Invalid user"
            }
        }
        return await prisma.onRampTransaction.findMany({
            where: {
                status: "Processing",
                userId: Number(userId)
            }
        });
    } catch (error) {
        console.log(error);
        return [];
    }
}
