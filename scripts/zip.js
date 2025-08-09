import { createWriteStream } from 'fs';
import { readdir, stat } from 'fs/promises';
import { join } from 'path';
import { createReadStream } from 'fs';

async function createZip() {
  // Simple zip creation for the extension package
  // For now, we'll just indicate the files that would be zipped
  console.log('Creating extension package...');
  
  const distFiles = await getFilesRecursively('dist');
  console.log('Files to package:');
  distFiles.forEach(file => console.log(`  ${file}`));
  
  // In a real implementation, you'd use a zip library like 'archiver'
  // For now, just indicate success
  console.log('Extension package would be created as: change-accountability.zip');
  console.log('Note: Install a zip library like "archiver" for actual zip creation');
}

async function getFilesRecursively(dir) {
  const files = [];
  const items = await readdir(dir);
  
  for (const item of items) {
    const itemPath = join(dir, item);
    const stats = await stat(itemPath);
    
    if (stats.isDirectory()) {
      const subFiles = await getFilesRecursively(itemPath);
      files.push(...subFiles);
    } else {
      files.push(itemPath);
    }
  }
  
  return files;
}

createZip().catch(console.error);