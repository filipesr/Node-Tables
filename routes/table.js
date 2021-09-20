const Table = require("../models/Table");
const {
  verifyToken,
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin,
} = require("./verifyToken");

const router = require("express").Router();

//CREATE
router.post("/", verifyTokenAndAdmin, async (req, res) => {
  const newTable = new Table(req.body);

  try {
    const savedTable = await newTable.save();
    res.status(200).json(savedTable);
  } catch (err) {
    res.status(500).json(err);
  }
});

//UPDATE
router.put("/:id", verifyTokenAndAuthorization, async (req, res) => {
  try {
    const updatedTable = await Table.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );
    res.status(200).json(updatedTable);
  } catch (err) {
    res.status(500).json(err);
  }
});

//UPDATE OCUPATION
router.put("/ocupation/:id", verifyTokenAndAuthorization, async (req, res) => {
  try {
    const { peoples } = req.body;
    // console.log(`Change ocupation of ${req.params.id} to ${peoples}...`);
    const updatedTable = await Table.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          disponible: !peoples
        },
        $push: {
          ocupation:{
            $each: [req.body],
            $position: -1
          },
        },
      },
      { new: true }
    );
    res.status(200).json(updatedTable);
  } catch (err) {
    res.status(500).json(err);
  }
});

//DELETE
router.delete("/:id", verifyTokenAndAdmin, async (req, res) => {
  try {
    // console.log(`Deleting ${req.params.id}...`);
    await Table.findByIdAndDelete(req.params.id);
    res.status(200).json("Table has been deleted...");
  } catch (err) {
    res.status(500).json(err);
  }
});

//GET Table
router.get("/:id", verifyTokenAndAuthorization, async (req, res) => {
  try {
    // console.log(`Finding ${req.params.id}...`);
    res.status(200).json(await Table.findById(req.params.id));
  } catch (err) {
    res.status(500).json(err);
  }
});

//GET ALL Tables
router.get("/", verifyToken, async (req, res) => {
  // const qNew = req.query.new;
  // const qCategory = req.query.category;
  try {
    let Tables;

    // if (qNew) {
    //   Tables = await Table.find().sort({ createdAt: -1 }).limit(1);
    // } else if (qCategory) {
    //   Tables = await Table.find({
    //     categories: {
    //       $in: [qCategory],
    //     },
    //   });
    // } else {
      Tables = await Table.find({enable: true}, {_id:  1, code: 1, disponible:  1});
    // }

    res.status(200).json(Tables);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
