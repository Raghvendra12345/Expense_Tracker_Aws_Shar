// const expenseModel = require("../models/expensesModel");
// const userModel=require('../models/userModel');

const { userModel, expenseModel } = require("../models");

const { Sequelize } = require("sequelize");

const addExpense = async (req, res) => {
  try {
    const { expenseamount, description, category } = req.body;

    if (!expenseamount || !description || !category) {
      return res.status(404).json({
        success: false,
        err: "Bad Parameters Something is missing",
      });
    }

    const response = await expenseModel.create({
      expenseamount: expenseamount,
      description: description,
      category: category,
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
    });
    res.status(200).json(leaderboardusers);
  } catch (err) {
    console.log(err);
    res.status(500).json({ err: err.message });
  }
};

const downloadExpenses = async (req, res) => {
  try {
    const expense = await expenseModel.findAll({
      where: {
        userId: req.user.userId,
      },
    });
    res.status(200).json(expense);
  } catch (err) {
    res.status(500).json({ message: "Download failed" });
    console.log(err);
  }
};

module.exports = {
  addExpense,
  getExpense,
  deleteExpense,
  showLeaderBoard,
  downloadExpenses,
};
