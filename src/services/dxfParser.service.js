const fs = require('fs');
const DxfParser = require('dxf-parser');

const parseDXF = async (filePath) => {
  const parser = new DxfParser();
  const dxfContent = fs.readFileSync(filePath, 'utf-8');
  const parsed = parser.parseSync(dxfContent);

  const blocks = parsed.blocks || {};
  const blockData = [];

  for (const blockName in blocks) {
    const block = blocks[blockName];
    if (block && block.entities) {
      const entityCount = block.entities.length;

      // These are the base point values you've been hunting for 🧙‍♂️
      const baseX = block.x || block.baseX || block.basePoint?.x || block.position?.x || 0;
      const baseY = block.y || block.baseY || block.basePoint?.y || block.position?.y || 0;
      const baseZ = block.z || block.baseZ || block.basePoint?.z || block.position?.z || 0;

      blockData.push({
        name: block.name || blockName,
        entityCount,
        basePoint: [baseX, baseY, baseZ],
      });
    }
  }

  return blockData;
};

module.exports = { parseDXF };
