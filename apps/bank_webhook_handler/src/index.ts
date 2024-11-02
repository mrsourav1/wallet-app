import express from "express";
import db from "@repo/db/client";
import cors from "cors"
const app = express();

app.use(express.json())

app.use(cors({
    origin: 'http://localhost:3000', 
    credentials:true
}));

app.get("/hdfcWebhook",async(req,res)=>{
    res.send("hiii")
})

app.post("/hdfcWebhook", async (req, res) => {
    const paymentInformation: {
        token: string;
        userId: string;
        amount: string
    } = {
        token: req.body.token,
        userId: req.body.user_identifier,
        amount: req.body.amount
    };

    console.log(req.body)
    console.log(paymentInformation)
    console.log(paymentInformation.userId)

    try {
        await db.$transaction([
            db.balance.update({
                where: {
                    userId: Number(paymentInformation.userId)
                },
                data: {
                    amount: {
                        // You can also get this from your DB
                        increment: Number(paymentInformation.amount)
                    }
                }
            }),
            db.onRampTransaction.update({
                where: {
                    token: paymentInformation.token
                }, 
                data: {
                    status: "Success",
                }
            })
        ]);

        res.json({
            message: "Captured"
        })
    } catch(e) {
        console.error(e);
        res.status(411).json({
            message: "Error while processing webhook"
        })
    }

})

app.listen(3003);