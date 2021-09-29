const mongoose = require("mongoose");

const TableSchema = new mongoose.Schema(
  {
    code: { type: String, required: true, unique: true },
    type:  { type: String, required: true, default: 'mesa' },
    ocupation: [{ 
      peoples: { type: Number, default: 0 }, 
      date: { type: Date, default: mongoose.now }, 
    }],
    disponible: { type: Boolean, default: true },
    enable: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Table", TableSchema);
