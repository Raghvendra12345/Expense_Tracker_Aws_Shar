

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

       if(response.status==201){
          window.location.href="../Login/login.html"  //change the page on successful login
       }
       else{
          throw new Error('Failed to login')
       }


    }
     catch(err){
         document.body.innerHTML+=`<div style="color:red">${err}</div>`
     }
   



}