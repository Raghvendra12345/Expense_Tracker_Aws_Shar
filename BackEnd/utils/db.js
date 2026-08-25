

const sequelize=require("sequelize")

const sequelizeData=new sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
    host:process.env.DB_HOST,
    dialect:process.env.DB_DIALECT || "mysql",

    logging:false,

    pool:{
        max:10,
        min:0,
        acquire:30000,
        idle:10000
    }

});

// (
//     async ()=>{
//         try{
//             await sequelizeData.authenticate()
//             console.log("Connected successfully")

//         }
//         catch(error){
//              console.log({error:error.message})
//         }
//     }
// )()

module.exports=sequelizeData