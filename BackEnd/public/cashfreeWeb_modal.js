    const cashfree = Cashfree({
        mode: "sandbox",
    });
    document.getElementById("renderBtn").addEventListener("click", async() => {

        try{
            const response=await fetch("http://localhost:4500/pay",{
                method:"POST",
            })
            const data=await response.json()
            const paymentSessionId=data.paymentSessionId;

            //Intializ checkout options
            let checkoutOptions={
                paymentSessionId:paymentSessionId,
                 
                //New Page payment options
                redirectTarget:"_modal"  //default
            };

            //Start the checkout process
            const result=await cashfree.checkout(checkoutOptions)

            if(result.error){
                // this will be true whenever user clicks on close icon inside the modal or any error happens
                //   during the payment
                console.log("User has closed the popup or there is some payment error,Check for payment")
                console.log(result.error)
            }
            if(result.redirect){
                //This will be true when the payment redirection page couldn't be opened in the same browser
                //Exceptional case page is opened inside an inAppBrowser
                //customer will be redirected to return url once payment is completed
                console.log("Payment will be redirected")
            }
            if(result.paymentDetails){
                //this will be called whenever the payment is completed irrespective of transaction status
                console.log("Payment has been completed,Check for payment status")
                console.log(result.paymentDetails.paymentMessage)

                const response=await fetch(`http://localhost:4500/payment-status/${orderId}`,{
                    method:"GET",
                })
                const data=await response.json()
                alert("Your payment is "+data.orderStatus)
            }

        }
        catch(error){
                 console.error("Error:",error)
        }
            
    
     
});