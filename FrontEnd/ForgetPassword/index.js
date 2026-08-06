

async function forgetPassword(event){
    event.preventDefault()


    const email=event.target.email.value

    console.log(email)

    try{

        const response=await fetch("http://localhost:4500/expense/forgotpassword",{
            method:"POST",
        headers:{
            "Content-Type":"application/json"
        },
        body:JSON.stringify({email})
    })
    const data=await response.json()
    alert(data.message)

    }
    catch(err){
        console.log(err)
    }
    
}