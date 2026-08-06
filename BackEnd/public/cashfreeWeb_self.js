
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
                redirectTarget:"_self"  //default
            };

            //Start the checkout process
            await cashfree.checkout(checkoutOptions)

        }
        catch(error){
                 console.error("Error:",error)
        }
            
    
     
});