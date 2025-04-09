const { EntitySchema } = require("typeorm");

module.exports = new EntitySchema({
  name: "Block",
  tableName: "blocks",
  columns: {
    id: {
      primary: true,
      type: "int",
      generated: true,
    },
    fileName: {
      type: "varchar",
     name: "file_name"
    },
    blockName: {
      type: "varchar",
      name: "block_name",
    },
    baseX: {
      type: "float",
      name: "base_x",
    },
    baseY: {
      type: "float",
      name: "base_y",
    },
    baseZ: {
      type: "float",
      name: "base_z",
    },
    entityCount: {
      type: "int",
      name: "entity_count",
    },
    createdAt: {
      type: "timestamp",
      createDate: true,
    },
  },
});
