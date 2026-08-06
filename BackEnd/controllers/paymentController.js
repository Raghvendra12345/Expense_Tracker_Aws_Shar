
const { createOrder,getPaymentStatus:fetchPaymentStatus } = require("../services/cashfreeService");
const Payment=require("../models/paymentModel")
const User=require("../models/userModel")
const generateAccessToken=require("../utils/generateToken");
exports.getPaymentPage=(req,res)=>{
    res.sendFile(Path.join(__dirname,"../views/index.html"))
}

exports.processPayment=async(req,res)=>{
    const orderId="Order-"+Date.now()
    const orderAmount=2000;
    const orderCurrency="INR";
    const customerID=req.user.userId.toString();
    const customerPhone="9999999999"


    try{
        //create an order in cashfree and get the payment session ID

        const paymentSessionId=await createOrder(
            orderId,
            orderAmount,
            orderCurrency,
            customerID,
            customerPhone,
        );
        console.log("Payment Session ID:", paymentSessionId)

        //Save payment details to the database
       const payment= await Payment.create({
            userId:req.user.userId,
            orderId,
            paymentSessionId,
            orderAmount,
            orderCurrency,
            paymentStatus:"Pending"
        });
        console.log("PAYMENT SAVED");
         console.log(payment.toJSON());
        res.json({paymentSessionId,orderId});
        console.log("Saved Payment:", payment);
    }
    catch(error){
        console.log("Error processing payment:",error.message)
        res.status(500).json({message:"Error Processing payment"})
    }
}

exports.getPaymentStatus=async(req,res)=>{
     console.log("getPaymentStatus called");
    console.log(req.params);
    try{
         const {orderId}=req.params
         console.log("Order ID =", orderId);

    const orderStatus=await fetchPaymentStatus(orderId)
    const payment = await Payment.findOne({
    where:{
        orderId
    }
    });

      console.log(payment);
      console.log(payment.userId);


    await Payment.update(
        {paymentStatus:orderStatus},
        {
            where:{orderId}
        }
    )
    console.log("getPaymentStatus called");
      console.log(req.params);
       
    //fetch data from payment Cashfree db status
    // res.json({orderStatus})
    if(orderStatus=="Success"){
        await User.update(
            {
                isPremiumUser:true
            },
        
        {
            where:{
                id:payment.userId
            }
        }
    )
    

    console.log("User upgraded to Premium");
    }
    const updatedUser = await User.findByPk(payment.userId);
    const token = generateAccessToken(
    updatedUser.id,
    updatedUser.username,
    updatedUser.isPremiumUser
      );
    res.redirect(`http://127.0.0.1:5501/SQL/Expense_Tracker_Nodejs_AWS/FrontEnd/ExpenseTracker/index.html?token=${token}`)



    }
    catch(error){
        console.log("FULL ERROR:", error);
        res.status(500).json({message:"Unable to fetch payment status"})
    }
   
}


exports.getPremiumStatus=async(req,res)=>{
    res.status(200).json({isPremiumUser:req.user.isPremiumUser})
}