"use server";

import prisma from "@repo/db/client";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth";

export async function createOnRampTransaction(provider: string, amount: number) {
    // Ideally the token should come from the banking provider (hdfc/axis)
    const session = await getServerSession(authOptions);
    if (!session?.user || !session.user?.id) {
        return {
            message: "Unauthenticated request"
        }
    }
    const token = (Math.random() * 1000).toString();
    const transactionData = await prisma.onRampTransaction.create({
        data: {
            provider,
            status: "Processing",
            startTime: new Date(),
            token: token,
            userId: Number(session?.user?.id),
            amount: amount * 100,
            transactionType: 'deposite'
        }
    });
    await prisma.ledger.create({
        data: {
            userId: Number(session.user?.id),
            type: 'deposite',
            transactionId: transactionData.id,
            amount: amount * 100
        }
    });
    // await prisma.balance.create({
    //     data: {
    //         userId: Number(session.user?.id),
    //         locked: amount * 100,
    //         amount:
    //     }
    // })
    return {
        message: "Done"
    }
}
