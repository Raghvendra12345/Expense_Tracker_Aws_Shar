

const userModel=require('./userModel')
const expenseModel=require('./expensesModel')
const Payment=require('./paymentModel')
const forgotPassword=require("./forgotPasswordModel")


userModel.hasMany(expenseModel,{
    foreignKey:"userId"
})

expenseModel.belongsTo(userModel,{
    foreignKey:"userId"
})


userModel.hasMany(forgotPassword,{
    foreignKey:"userId"
})

forgotPassword.belongsTo(userModel,{
    foreignKey:"userId"
})


module.exports={
    userModel,
    expenseModel,
    forgotPassword
}