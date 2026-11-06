# SmartExpense – AI-Powered Expense Management Platform

SmartExpense is a full-stack expense management application designed to help users track, manage, analyze, and monitor their daily expenses. It provides secure user authentication, expense management, financial reports, premium membership, and AI-powered expense assistance using Google Gemini.

The application is built using **Node.js, Express.js, Sequelize, MySQL, JWT, AWS, and Google Gemini AI**.

## 🚀 Features

### 🔐 User Authentication
- User registration and login.
- JWT-based authentication and authorization.
- Secure password hashing.
- User-specific expense management.
- Protected API endpoints.

### 💰 Expense Management
- Add new expenses with amount, description, and date.
- View all personal expenses.
- Update existing expense records.
- Delete expenses.
- User-specific expense data management.

### 📊 Financial Reports & Analytics
- Daily expense reports.
- Monthly expense reports.
- Yearly expense reports.
- Expense summaries and analysis.
- Download expense reports.

### 🤖 AI-Powered Expense Assistant
- Integrated Google Gemini AI.
- AI-powered expense-related queries.
- Intelligent assistance for understanding spending patterns.
- API quota and error handling.

### 💎 Premium Membership
- Premium membership functionality.
- Cashfree payment gateway integration.
- Payment order creation and verification.
- Premium user access management.
- Leaderboard functionality for premium users.

### ☁️ Cloud Integration
- AWS integration for cloud-based services.
- Database deployment using AWS RDS.
- Environment-based configuration.
- Secure management of application credentials.

## 🛠️ Tech Stack

| Category | Technologies |
|---|---|
| Backend | Node.js, Express.js |
| Frontend | HTML, CSS, JavaScript |
| Database | MySQL |
| ORM | Sequelize |
| Authentication | JWT, bcrypt |
| AI Integration | Google Gemini API |
| Payment Gateway | Cashfree |
| Cloud Services | AWS RDS |
| API Development | REST APIs |
| Development Tools | Git, GitHub, Postman |

## 📂 Project Structure

```text
SmartExpense/
│
├── config/
│   └── database.js
│
├── controllers/
│   ├── userController.js
│   ├── expenseController.js
│   └── premiumController.js
│
├── models/
│   ├── User.js
│   └── Expense.js
│
├── routes/
│   ├── userRoutes.js
│   ├── expenseRoutes.js
│   └── premiumRoutes.js
│
├── middleware/
│   └── authMiddleware.js
│
├── public/
│   ├── index.html
│   ├── css/
│   └── js/
│
├── services/
│
├── .env
├── .gitignore
├── package.json
└── app.js
```


## 🔄 Application Workflow

1. Users register and log in to the application.
2. JWT authentication protects user-specific resources.
3. Users can create, view, update, and delete their expenses.
4. Expense data is stored in MySQL using Sequelize ORM.
5. Users can generate daily, monthly, and yearly financial reports.
6. Reports can be downloaded for personal financial tracking.
7. Gemini AI provides intelligent assistance for expense-related queries.
8. Users can purchase premium membership through Cashfree payment integration.
9. Premium users can access additional features, including leaderboard functionality.

## 🔑 Key Backend Concepts Implemented

- RESTful API development.
- MVC architecture.
- JWT authentication and authorization.
- Password hashing using bcrypt.
- Relational database management with MySQL.
- Sequelize ORM and model relationships.
- CRUD operations.
- Third-party API integration.
- Payment gateway integration.
- Cloud database deployment.
- Error handling and API validation.
- Environment-based configuration.

## 🔒 Security

- Password hashing using bcrypt.
- JWT-based authentication.
- Protected API endpoints.
- User-specific expense access.
- Environment variables for sensitive credentials.
- Payment verification through the payment gateway.

## 👨‍💻 Author

**Your Name**

- GitHub: https://github.com/Raghvendra12345
- LinkedIn: https://www.linkedin.com/in/raghvendra-kumar-451a38204

---

⭐ If you find this project useful, feel free to explore the repository and give it a star!
