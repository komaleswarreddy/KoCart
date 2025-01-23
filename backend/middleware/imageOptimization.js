const sharp = require('sharp');
const path = require('path');
const fs = require('fs').promises;

const optimizeImage = async (req, res, next) => {
  if (!req.file) return next();

  try {
    const optimizedImageBuffer = await sharp(req.file.buffer)
      .resize(800, 800, {
        fit: 'inside',
        withoutEnlargement: true
      })
      .webp({ quality: 80 })
      .toBuffer();

    const filename = `${Date.now()}-${path.parse(req.file.originalname).name}.webp`;
    const uploadPath = path.join(__dirname, '../uploads', filename);

    await fs.writeFile(uploadPath, optimizedImageBuffer);
    
    req.file.filename = filename;
    req.file.path = `/uploads/${filename}`;
    
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = optimizeImage;
