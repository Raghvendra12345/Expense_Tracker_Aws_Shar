

async function handleLogin(event){

     try{
            event.preventDefault()
            const email=event.target.email.value
            const password=event.target.password.value

            const loginDetails={
              email,password
            }
           console.log(loginDetails)
       
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
           throw new Error("failed to login")
       }



     }
     catch(err){
          console.log(err)
          document.body.innerHTML+=`<div style="color:red;">${err.message}</div>`
     }
    
}