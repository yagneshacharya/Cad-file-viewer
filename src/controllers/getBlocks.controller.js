const { AppDataSource } = require('../data-source');
const Block = require('../entities/Block');

const getAllBlocks = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 5;
  const offset = (page - 1) * limit;
  try {
    const blockRepo = AppDataSource.getRepository('Block');

    const [blocks, total] = await blockRepo.findAndCount({
      order: { id: 'DESC' },
      skip: offset,
      take: limit,
    });

    res.status(200).json({
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalBlocks: total,
      blocks,
    });
  } catch (err) {
    console.error('Error fetching blocks:', err.message);
    res.status(500).json({ error: 'Failed to fetch blocks' });
  }
};

// GET /api/blocks/:id
const getBlockById = async (req, res) => {
  const blockId = parseInt(req.params.id);

  try {
    const blockRepo = AppDataSource.getRepository('Block');
    const block = await blockRepo.findOneBy({ id: blockId });

    if (!block) {
      return res.status(404).json({ error: 'Block not found' });
    }

    res.status(200).json(block);
  } catch (err) {
    console.error('Error fetching block by ID:', err.message);
    res.status(500).json({ error: 'Failed to fetch block' });
  }
};

const searchBlocks = async (req, res) => {
  const { search = "", page = 1, limit = 5 } = req.query;

  const parsedPage = parseInt(page);
  const parsedLimit = parseInt(limit);
  const offset = (parsedPage - 1) * parsedLimit;

  try {
    const blockRepo = AppDataSource.getRepository('Block');

    const queryBuilder = blockRepo.createQueryBuilder('block');

    if (search) {
      queryBuilder.where('block.blockName ILIKE :search', { search: `%${search}%` });
    }

    // Count total matching results
    const total = await queryBuilder.getCount();

    // Fetch paginated results
    const results = await queryBuilder
      .orderBy('block.id', 'DESC')
      .skip(offset)
      .take(parsedLimit)
      .getMany();

    res.status(200).json({
      currentPage: parsedPage,
      totalPages: Math.ceil(total / parsedLimit),
      totalBlocks: total,
      blocks: results,
    });
  } catch (err) {
    console.error('Error searching blocks:', err.message);
    res.status(500).json({ error: 'Failed to search blocks' });
  }
};


module.exports = {
  getAllBlocks,
  getBlockById,
  searchBlocks,
};
