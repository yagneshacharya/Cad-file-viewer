const path = require("path");
const { parseDXF } = require("../services/dxfParser.service.js");
const { AppDataSource } = require("../data-source");
const Block = require("../entities/Block"); // Assuming this is your entity schema

const handleFileUpload = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    // Check file extension
    const isDxf = req.file.originalname.toLowerCase().endsWith(".dxf");

    if (!isDxf) {
      return res.status(400).json({ error: "Only DXF files are allowed" });
    }

    const filePath = path.join(__dirname, "../../uploads", req.file.filename);
    const blocksData = await parseDXF(filePath);

    const blockRepo = AppDataSource.getRepository("Block");

    const savedBlocks = [];

    for (const block of blocksData) {
      const blockEntity = blockRepo.create({
        fileName: req.file.originalname,
        blockName: block.name,
        baseX: block.basePoint[0],
        baseY: block.basePoint[1],
        baseZ: block.basePoint[2],
        entityCount: block.entityCount,
      });

      const saved = await blockRepo.save(blockEntity);
      savedBlocks.push(saved);
    }

    res.status(200).json({
      message: "DXF blocks parsed and saved successfully",
      blocks: savedBlocks,
    });
  } catch (err) {
    console.error("Upload Error:", err.message);
    return res
      .status(500)
      .json({ error: "Server error while processing file" });
  }
};

module.exports = { handleFileUpload };
