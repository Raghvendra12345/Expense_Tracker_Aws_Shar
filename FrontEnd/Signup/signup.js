

async function handleFormSubmit(event){


    try{

         event.preventDefault()
        const username=event.target.username.value
        const email=event.target.email.value
       const password=event.target.password.value

       const signupDetails={
           username,
           email,
           password
       }
       console.log(signupDetails)

    //    const response=await axios.post('http://localhost:3000/user/signup',signupDetails)

    const response=await fetch("http://localhost:4500/expense/signup",{
        method:"POST",
        headers:{
           "Content-Type":"application/json",
        },
        body:JSON.stringify(signupDetails)
    })
       const data=await response.json()

       if(response.status==201){
          window.location.href="../Login/login.html"  //change the page on successful login
       }
       else{
         //  throw new Error('Failed to Signup')
         showMessage(data.error || data.message || "Signup Failed")
       }


    }
     catch(err){
         showMessage("Something went wrong ! Try again later")
     }
   



}


function showMessage(message){
   const messageElement=document.getElementById("message")
   messageElement.textContent=message
   messageElement.style.display="block"
    messageElement.style.color="red"
}