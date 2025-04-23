import sharp from 'sharp';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function optimizeImage(inputPath) {
  try {
    const filename = path.basename(inputPath);
    console.log(`Processing ${filename}...`);
    
    // Get original file size
    const originalStats = fs.statSync(inputPath);
    const originalSize = originalStats.size;
    
    const buffer = await sharp(inputPath)
      .resize(256, 256, { fit: 'inside', withoutEnlargement: true })
      .png({ quality: 85, compressionLevel: 9 })
      .toBuffer();
    
    fs.writeFileSync(inputPath, buffer);
    
    // Get new file size
    const newStats = fs.statSync(inputPath);
    const newSize = newStats.size;
    
    const reduction = ((originalSize - newSize) / originalSize * 100).toFixed(2);
    
    console.log(`Optimized ${filename}:`);
    console.log(`  Original size: ${(originalSize / 1024).toFixed(2)} KB`);
    console.log(`  New size: ${(newSize / 1024).toFixed(2)} KB`);
    console.log(`  Reduction: ${reduction}%`);
    
    return { success: true, filename, originalSize, newSize, reduction };
  } catch (error) {
    console.error(`Error processing ${inputPath}:`, error);
    return { success: false, error: error.message };
  }
}

// Process the images passed as arguments
async function main() {
  const imagePaths = process.argv.slice(2);
  
  if (imagePaths.length === 0) {
    console.error('Please provide image paths as arguments');
    process.exit(1);
  }
  
  for (const imagePath of imagePaths) {
    await optimizeImage(imagePath);
  }
}

main().catch(console.error);
