"use client"
import { Select } from "@repo/ui/select";
import { useEffect, useState } from "react";
import { getWebhookData } from "../app/lib/actions/getWebhookData";
import { processPayment } from "../app/lib/actions/processPayment";
import axios from "axios";

type WebhookDataItem = {
    id: number;
    status: "Success" | "Failure" | "Processing";
    provider: string;
    amount: number;
    startTime: Date;
    transactionType: string;
    userId: number;
};


export const WebhookTable = () => {
    const [statusSelected, setStatusSelected] = useState<string>("");
    const statusOptions = [
        "Success",
        "Failure",
        "Processing"
    ]
    const [data, setData] = useState<WebhookDataItem[]>([])

    const handleStatusChange = async (data:any, value:any) => {
        setStatusSelected(value);
        // await processPayment({ id });
        const response = await axios.post("http://localhost:3003/hdfcWebhook",{
            token: data.token,
            user_identifier: Number(data.userId),
            amount: (data.amount/100)
        },{
            withCredentials:true
        }
    )
        console.log("this is repose",response)

        // Update the status of the item locally
        setData((prevData) =>
            prevData.map((item) =>
                item.id === data.id ? { ...item, status: "Success" } : item
            )
        );
    };

    useEffect(() => {
        const fetchData = async () => {
            const result = await getWebhookData();

            if (Array.isArray(result)) {
                setData(result);
            } else if (result && result.message) {
                console.log(result.message);
            }
        };

        fetchData();
    }, []);

    return (
        <div className="relative overflow-x-auto">
            {
                data.length !== 0 ?
                    <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                            <tr>
                                <th scope="col" className="px-6 py-3">
                                    Status
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Amount
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    UserId
                                </th>
                                <th>
                                    Date
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.map((item, index) => (
                                <tr
                                    key={index}
                                    className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
                                >
                                    {/* <td className="px-6 py-4">{item.status}</td> */}
                                    <td className="px-6 py-4">
                                        {
                                            item.status !== "Success" ?
                                                <Select
                                                onSelect={(value) =>
                                                    handleStatusChange(item, value)
                                                }
                                                    options={statusOptions.map(x => ({
                                                        key: x,
                                                        value: x
                                                    }))}
                                                />
                                                : item.status
                                        }
                                    </td>
                                    <td className="px-6 py-4">{(item.amount / 100).toFixed(2)}</td>
                                    <td className="px-6 py-4">{item.userId}</td>
                                    <td className="px-6 py-4">{new Date(item.startTime).toLocaleString()}</td>
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