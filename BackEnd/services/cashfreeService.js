
const { Cashfree, CFEnvironment }=require("cashfree-pg")

const cashfree = new Cashfree(CFEnvironment.SANDBOX, "TEST430329ae80e0f32e41a393d78b923034", "TESTaf195616268bd6202eeb3bf8dc458956e7192a85");

exports.createOrder = async (
        orderId,
        orderAmount,
        orderCurrency="INR",
        customerID,
        customerPhone
     )=>{
        try{
            const expiryDate=new Date(Date.now()+60*60*1000)  //1 hour from now
            const formattedExpiryDate=expiryDate.toISOString()

            const request={
                order_amount:orderAmount,
                order_currency:orderCurrency,
                order_id:orderId,

                customer_details:{
                    customer_id:customerID,
                    customer_phone:customerPhone
                },
                "order_meta":  {
                     "return_url": `http://localhost:4500/expense/payment-status/${orderId}`, //calling payment-status
                      payment_methods:"ccc,upi,nb"
                },
                order_expiry_time:formattedExpiryDate,  //!? set the valid expriy date

            };
            const response=await cashfree.PGCreateOrder(request)
                     
            return response.data.payment_session_id;

 
           }
           catch(error){
            console.log("STATUS:", error.response?.status);
            console.log("DATA:", error.response?.data);
             console.log("MESSAGE:", error.message);
            console.error("Error creating order:",error.message)
           }
};



// exports.getPaymentStatus=async(orderId)=>{
//     try{
//         console.log("Fetching Payment Status");
//         console.log("Order ID =", orderId);

//         const response=await cashfree.PGOrderFetchPayment(orderId)

//         let getOrderResponse=response.data
//         let orderStatus;

//         if(getOrderResponse.filter(
//             (transaction)=>transaction.payment_status==="SUCCESS"
//         ).length > 0)
//         {
//             orderStatus="Success"
//         }
//         else if(
//             getOrderResponse.filter(
//                  (transaction)=>transaction.payment_status==="PENDING"
//             ).length >0 )
//             {
//                 orderStatus="Pending"
//             }
//         else{
//             orderStatus="Failure"
//         }
//         return orderStatus
//     }
//     catch(error){
//         console.error("Error fetching order status",error.message)
//     }
//     console.log("PARAMS:", req.params);
//     console.log("QUERY:", req.query);

//     res.json({
//         params:req.params,
//         query:req.query
//     });
// }
    
exports.getPaymentStatus = async(orderId)=>{
    try{
        console.log("Fetching Payment Status");
        console.log("Order ID =", orderId);



        const response = await cashfree.PGOrderFetchPayments(orderId);

        console.log("Cashfree response:");
        console.log(response.data);

        console.log("Cashfree response:");
        console.log(response.data);

        const payments = response.data;

        const successPayment = payments.find(
            payment => payment.payment_status === "SUCCESS"
        );

        if (successPayment) {
            return "Success";
        }

        const pendingPayment = payments.find(
            payment => payment.payment_status === "PENDING"
        );

        if (pendingPayment) {
            return "Pending";
        }

        return "Failure";

        // return "Success";
    }
    catch(error){
        console.error(error.message);
    }
}

