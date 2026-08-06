


const sequelize=require("../utils/db")
const { DataTypes,Sequelize } = require("sequelize")



const Payment=sequelize.define('payment',{
    id:{
        type:DataTypes.INTEGER,
        autoIncrement:true,
        allowNull:false,
        primaryKey:true
    },
    orderId:{
        type:DataTypes.STRING,
        allowNull:false,
        unique:true
    },
    paymentSessionId:{
        type:DataTypes.STRING,
        allowNull:false
    },
    orderAmount:{
        type:DataTypes.INTEGER,
        
        allowNull:false,
        
    },
    orderCurrency:{
        type:DataTypes.STRING,
        allowNull:false,
        defaultValue:"INR"
    },
    paymentStatus:{
        type:DataTypes.STRING,
        allowNull:false,
        defaultValue:"Pending"
    },
    userId:{
        type:DataTypes.INTEGER,
        allowNull:false
    }
})

module.exports=Payment