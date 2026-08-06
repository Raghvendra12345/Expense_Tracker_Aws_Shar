

const sequelize=require("sequelize")

const sequelizeData=new sequelize("expense_tracker_aws","root","Raghav@123",{
    host:"localhost",
    dialect:"mysql"
});

(
    async ()=>{
        try{
            await sequelizeData.authenticate()
            console.log("Connected successfully")

        }
        catch(error){
             console.log({error:error.message})
        }
    }
)()

module.exports=sequelizeData