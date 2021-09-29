const User = require("../models/User");
const CryptoJS = require("crypto-js");
const {
  verifyToken,
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin,
} = require("./verifyToken");

const router = require("express").Router();

//UPDATE
router.put("/:id", verifyTokenAndAuthorization, async (req, res) => {
  if (req.body.password) {
    req.body.password = CryptoJS.AES.encrypt(
      req.body.password,
      process.env.PASS_SEC
    ).toString();
  }

  User
    .findByIdAndUpdate( req.params.id, { $set: req.body }, { new: true } )
    .then((item) => res.status(200).json("Updated..."))
    .catch((err) => res.status(500).json(err));
});

//DELETE
router.delete("/:id", verifyTokenAndAuthorization, async (req, res) => {
  User
    .findByIdAndDelete(req.params.id)
    .then(() => res.status(200).json("Deleted..."))
    .catch((err) => res.status(500).json(err))
});

//GET USER
router.get("/find/:id", verifyTokenAndAdmin, async (req, res) => {
  User
    .findById(req.params.id)
    .then((item) => res.status(200).json(item))
    .catch((err) => res.status(500).json(err));
});

//GET ALL USER
router.get("/", verifyTokenAndAdmin, async (req, res) => {
  const { new: qNew, search } = req.query;
  // console.log(req.query);

  // query -> params
  const where = qNew ? {}
              : search ? { username: { $regex: search, $options: 'i' } }
              : !req.user.isAdmin 
              ? { isAdmin: false }
              : { };
  const fields = {_id:  1, username: 1, email: 1, isAdmin:  1, createdAt: 1 };
  const sort = { createdAt: -1 };
  const limit = qNew ?  5 : 0;
  
  // query -> return
  User
    .find(where, fields)
    .sort(sort)
    .limit(limit)
    .then((data) => res.status(200).json(data))
    .catch((err) => res.status(500).json(err));
});

//GET USER STATS

router.get("/stats", verifyTokenAndAdmin, async (req, res) => {
  const date = new Date();
  const lastYear = new Date(date.setFullYear(date.getFullYear() - 1));

  User
    .aggregate([
      { $match: { createdAt: { $gte: lastYear }}},
      { $project: { month: { $month: "$createdAt" }}},
      { $group: { _id: "$month", total: { $sum: 1 }}},
    ])
    .then((data) => res.status(200).json(data))
    .catch((err) => res.status(500).json(err));
});

module.exports = router;
