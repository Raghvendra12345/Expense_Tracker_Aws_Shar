


const express=require("express")

const router=express.Router()
const userController=require("../controllers/userController")
const expenseController = require("../controllers/expenseController")
const resetPasswordController=require("../controllers/resetPasswordController")
const {getPaymentPage,processPayment,getPaymentStatus,getPremiumStatus}=require("../controllers/paymentController")

const userAuthentication=require('../middleware/auth')


router.post("/signup",userController.signup)
router.post("/login",userController.login)


router.post('/addexpense',userAuthentication.authentication,expenseController.addExpense)
router.get('/getexpense',userAuthentication.authentication,expenseController.getExpense)
router.delete('/delete/:expenseId',userAuthentication.authentication,expenseController.deleteExpense)

router.get('/',getPaymentPage)
router.post('/pay',userAuthentication.authentication,processPayment)
// router.get('/payment-status/:paymentSessionId',getPaymentStatus)
router.get('/payment-status/:orderId',getPaymentStatus)
router.get('/premium-status',userAuthentication.authentication,getPremiumStatus)
router.get('/showleaderboard',userAuthentication.authentication,expenseController.showLeaderBoard)



router.post('/forgotpassword',resetPasswordController.forgotPassword)

router.get('/resetpassword/:uuid',resetPasswordController.resetPasswordPage)
router.post("/updatepassword/:uuid",resetPasswordController.updatePassword);

router.get('/download',userAuthentication.authentication,expenseController.downloadExpenses)


module.exports=router