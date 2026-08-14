

async function handleLogin(event){

     try{
            event.preventDefault()
            const email=event.target.email.value
            const password=event.target.password.value

            const loginDetails={
              email,password
            }
        //    console.log(loginDetails)
           console.log("Login details:", loginDetails);
    console.log("Sending login request...");
       
       const response=await fetch("http://localhost:4500/expense/login",{
        method:"POST",
        headers:{
            "Content-Type":"application/json"
        },
        body:JSON.stringify(loginDetails)
       } )
      const data=await response.json()
       if(response.status==200){
        alert(data.message,"Login Successfull")
        localStorage.setItem('token',data.token)
        localStorage.setItem('isPremiumUser',data.isPremiumUser)
        window.location.href="../ExpenseTracker/index.html"

       }
       else{
           showMessage(data.err || data.message || "Login Failed")
       }



     }
     catch(err){
          console.log(err)
          showMessage("Something went Wrong !Try again Later")
     }
    
}

function showMessage(message){
    const messageElemnt=document.getElementById("message")
    messageElemnt.textContent=message
    messageElemnt.style.display="block"
    messageElemnt.style.color="red"
}