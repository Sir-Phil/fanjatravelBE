import paypal from "paypal-rest-sdk";
import dotenv from 'dotenv';

dotenv.config();

const paypalMode: string | undefined = process.env.PAYPAL_MODE;
const paypalClientId: string | undefined = process.env.PAYPAL_CLIENT_ID;
const paypalClientSecrete: string | undefined = process.env.PAYPAL_CLIENT_SECRET;

if (!paypalMode || !paypalClientId || !paypalClientSecrete) {
    throw new Error("Empty Paypal environment variables ");
}

paypal.configure({
    mode: paypalMode,
    client_id: paypalClientId,
    client_secret:paypalClientSecrete,
})

const createPayPalPayment = async (amount: number, useCard: boolean = false, totalAmount: number) => {
    const payMethod = useCard ? "credit_card" : "paypal";

    const createPaymentJson = {
        intent: "sale",
        payer: {
            payment_method : payMethod,
        },

        transactions : [
            {
                amount : {
                    total: totalAmount.toFixed(2),
                    currency: "USD",
                },
            },
        ],

        redirect_urls: {
            return_url: "https://magnificent-rabanadas-4a5afb.netlify.app/success",
            cancel_url: "https://magnificent-rabanadas-4a5afb.netlify.app/cancel"
        },
    };

    try {
        const payment = await new Promise<paypal.Payment>((resolve, reject) => {
            paypal.payment.create(createPaymentJson, (err, payment) => {
                if(err) reject(err);
                resolve(payment);
            });
        })
            const approvalUrl = Array.isArray(payment.links) ? payment.links.find((link) => link.rel === "approval_url")?.href: undefined;

            if(approvalUrl){
                return approvalUrl;
            }else {
                throw new Error("Approval URL not found");
            }
    } catch (error) {
        throw new Error("Paypal payment creation failed");   
     }
};

export default createPayPalPayment