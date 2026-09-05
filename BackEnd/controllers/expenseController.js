// const expenseModel = require("../models/expensesModel");
// const userModel=require('../models/userModel');

const { userModel, expenseModel } = require("../models");

const { Sequelize ,Op} = require("sequelize");

const addExpense = async (req, res) => {
  try {
    const { expenseamount, description, category ,date} = req.body;

    if (!expenseamount || !description || !category || !date) {
      return res.status(404).json({
        success: false,
        err: "Bad Parameters Something is missing",
      });
    }

    const response = await expenseModel.create({
      expenseamount: expenseamount,
      description: description,
      category: category,
      date:date,
      userId: req.user.userId,
    });

    return res.status(201).json({
      response,
      message: "Expense details successfully filled",
    });
  } catch (err) {
    return res.status(500).json({ err: err.message });
  }
};

const getExpense = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 5;
    const offset = (page - 1) * limit;

    const response = await expenseModel.findAll({
      where: {
        userId: req.user.userId,
      },
      limit,
      offset,
      order: [["id", "DESC"]],
    });
    const totalExpense=await expenseModel.count({
      where:{
        userId:req.user.userId
      }
    });

    const lastPage=Math.ceil(totalExpense/limit);
    const hasNextPage=page<lastPage;
    const nextPage=hasNextPage?page+1:null;
    const hasPreviousPage=page>1
    const previousPage=hasPreviousPage?page-1:null

    return res.status(200).json({
      response,
      currentPage:page,
      totalExpense,
      hasNextPage,
      hasPreviousPage,
      nextPage,
      previousPage,
      lastPage,
      success: true,
    });
  } catch (err) {
    return res.status(500).json({ err: err.message });
  }
};

const deleteExpense = async (req, res) => {
  try {
    const expenseId = req.params.expenseId;

    if (!expenseId) {
      return res.status(400).json({
        success: false,
        message: "Bad parameters expenseId undefined",
      });
    }

    const response = await expenseModel.destroy({
      where: {
        id: expenseId,
        userId: req.user.userId,
      },
    });

    return res.status(200).json({
      success: true,
      response,
    });
  } catch (err) {
    return res.status(500).json({ err: err.message });
  }
};

const showLeaderBoard = async (req, res) => {
  try {
    const leaderboardusers = await userModel.findAll({
      attributes: [
        "id",
        "username",
        [
          Sequelize.fn("sum", Sequelize.col("expenses.expenseamount")),
          "totalExpense",
        ],
      ],
      include: [
        {
          model: expenseModel,
          attributes: [],
        },
      ],
      group: ["user.id"],
      order: [[Sequelize.literal("totalExpense"), "DESC"]],
      // limit:10
    });
    res.status(200).json(leaderboardusers);
  } catch (err) {
    console.log(err);
    res.status(500).json({ err: err.message });
  }
};

// const downloadExpenses = async (req, res) => {
//   try {
//     const expense = await expenseModel.findAll({
//       where: {
//         userId: req.user.userId,
//       },
//     });
//     res.status(200).json(expense);
//   } catch (err) {
//     res.status(500).json({ message: "Download failed" });
//     console.log(err);
//   }
// };

const downloadExpenses = async (req, res) => {
  try {
    const { type, date, year } = req.query;

    const userId = req.user.userId;

    let whereCondition = {
      userId,
    };

    // DAILY
    if (type === "daily") {
      if (!date) {
        return res.status(400).json({
          success: false,
          message: "Date is required",
        });
      }

      whereCondition.date = date;
    }

    // MONTHLY
    else if (type === "monthly") {
      if (!date) {
        return res.status(400).json({
          success: false,
          message: "Month is required",
        });
      }

      // date = 2026-08
      const startDate = `${date}-01`;

      const [yearValue, monthValue] = date.split("-");

      const nextMonth = new Date(
        Number(yearValue),
        Number(monthValue),
        1
      );

      const endDate = nextMonth.toISOString().split("T")[0];

      whereCondition.date = {
        [Op.gte]: startDate,
        [Op.lt]: endDate,
      };
    }

    // YEARLY
    else if (type === "yearly") {
      if (!year) {
        return res.status(400).json({
          success: false,
          message: "Year is required",
        });
      }

      const startDate = `${year}-01-01`;
      const endDate = `${Number(year) + 1}-01-01`;

      whereCondition.date = {
        [Op.gte]: startDate,
        [Op.lt]: endDate,
      };
    }

    // If no type is provided
    else {
      return res.status(400).json({
        success: false,
        message: "Invalid report type",
      });
    }

    const expenses = await expenseModel.findAll({
      where: whereCondition,
      order: [["date", "DESC"]],
    });

    // TOTAL EXPENSE
    const totalExpense = expenses.reduce(
      (sum, expense) => sum + Number(expense.expenseamount),
      0
    );

    // CATEGORY-WISE TOTAL
    const categoryTotals = {};

    expenses.forEach((expense) => {
      const category = expense.category;

      if (!categoryTotals[category]) {
        categoryTotals[category] = 0;
      }

      categoryTotals[category] += Number(expense.expenseamount);
    });

    return res.status(200).json({
      success: true,
      type,
      totalExpense,
      totalNumberOfExpenses: expenses.length,
      categoryTotals,
      expenses,
    });

  } catch (err) {
    console.log(err);

    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

module.exports = {
  addExpense,
  getExpense,
  deleteExpense,
  showLeaderBoard,
  downloadExpenses,
};
