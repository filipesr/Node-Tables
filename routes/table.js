const Table = require("../models/Table");
const {
  verifyToken,
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin,
} = require("./verifyToken");

const router = require("express").Router();

//CREATE
router.post("/", verifyTokenAndAdmin, async (req, res) => {
  new Table(req.body)
    .save()
    .then((item) => res.status(200).json(item))
    .catch((err) => res.status(500).json(err));
});

//CREATE BATCH
router.post("/", verifyTokenAndAdmin, async (req, res) => {
  // paramns
  const { new: qNew, search } = req.query;
  // 
  new Table(req.body)
    .save()
    .then((item) => res.status(200).json(item))
    .catch((err) => res.status(500).json(err));
});

//UPDATE
router.put("/:id", async (req, res) => {
  Table
    .findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    )
    .then((item) => res.status(200).json(item))
    .catch((err) => res.status(500).json(err));
});

//UPDATE OCUPATION
router.put("/ocupation/:id", verifyTokenAndAuthorization, async (req, res) => {
  const { peoples } = req.body;
  // console.log(`Change ocupation of ${req.params.id} to ${peoples}...`);
  Table
    .findByIdAndUpdate(
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
    )
    .then((item) => res.status(200).json("Updated..."))
    .catch((err) => res.status(500).json(err));
});

//DELETE
router.delete("/:id", verifyTokenAndAdmin, async (req, res) => {
  Table
    .findByIdAndDelete(req.params.id)
    .then(() => res.status(200).json("Deleted..."))
    .catch((err) => res.status(500).json(err));
});

//GET Table
router.get("/:id", async (req, res) => {
  // console.log(`geting ${req.params.id}...`);
  Table
    .findById(req.params.id)
    .then((item) => res.status(200).json(item))
    .catch((err) => res.status(500).json(err));
});

//GET ALL Tables
router.get("/", async (req, res) => {
  // console.log(`geting list...`);
  const { new: qNew, search } = req.query;
  // console.log(req.query);

  // query -> params
  const where = qNew ? {}
              : search ? { title: { $regex: search, $options: 'i' } }
              : {};
  const fields = { _id:  1, code: 1, type: 1, disponible:  1, createdAt: 1 };
  const sort = (!qNew && !search ? { type: -1, code: 1 } : { createdAt: -1 });
  const limit = qNew ?  1 : 0;
  
  // query -> return
  Table
    .find(where, fields)
    .sort(sort)
    .limit(limit)
    .then((data) => res.status(200).json(data))
    .catch((err) => res.status(500).json(err));
});

module.exports = router;
