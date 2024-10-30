import prisma from "@repo/db/client";
import { authOptions } from "../app/lib/auth";
import { getServerSession } from "next-auth";

async function getLedger() {
    const session = await getServerSession(authOptions);
    const userId = session?.user?.id;

    if (!userId) {
        return {
            message: "Invalid user"
        }
    }
    return await prisma.ledger.findMany({
        where: {
            userId: Number(userId)
        }
    });
}

// The TransactionTable component that renders the ledger data
export const TransactionTable = async () => {
    const data = await getLedger();

    // Check if data contains a message (error case)
    if ('message' in data) {
        return <div>{data.message}</div>;
    }

    return (
        <div className="relative overflow-x-auto">
            {
                data.length !== 0 ? 
                <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                        <tr>
                            <th scope="col" className="px-6 py-3">
                                Date
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Type
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Amount
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((item, index) => (
                            <tr
                                key={index}
                                className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
                            >
                                <td className="px-6 py-4">{new Date(item.timestamp).toLocaleString()}</td>
                                <td className="px-6 py-4">{item.type}</td>
                                <td className="px-6 py-4">{(item.amount / 100).toFixed(2)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                :
                <h4 className="text-center">NO HISTORY FOUND</h4>
            }
        </div>
    );
}
