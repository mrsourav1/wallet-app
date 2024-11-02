"use server"
import { getServerSession } from "next-auth";
import { authOptions } from "../auth";
import prisma from "@repo/db/client";


export const processPayment = async ({ id }: {
    id: Number
}) => {
    const session = await getServerSession(authOptions);
    const userId = session?.user?.id

    if(!userId){
        return "Invalid Request"
    }

    const data = await prisma.onRampTransaction.findUnique({
        where: {
            id: Number(id)
        }
    })

    if (data?.status === "Processing") {
        const updatedTransaction = await prisma.onRampTransaction.update({
            where: {
                id: Number(id)
            },
            data: {
                status: "Success"
            }
        });
        return updatedTransaction;
    } else {
        throw new Error("Transaction not found");
    }
}