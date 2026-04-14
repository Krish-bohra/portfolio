const fs = require('fs');
const path = require('path');

const sourceDir = path.join(__dirname, '..'); // Points to Downloads\sequence
const destDir = path.join(__dirname, 'public', 'sequence');

// Create the public/sequence directory if it doesn't exist
if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir, { recursive: true });
}

let movedCount = 0;

// Read files from source directory
const files = fs.readdirSync(sourceDir);

// Handle sequence frames
files.forEach(file => {
  if (file.startsWith('ezgif-frame') && file.endsWith('.png')) {
    const sourcePath = path.join(sourceDir, file);
    const destPath = path.join(destDir, file);
    fs.copyFileSync(sourcePath, destPath);
    movedCount++;
  }
});

// Handle certificates
const certDestDir = path.join(__dirname, 'public', 'certificates');
if (!fs.existsSync(certDestDir)) fs.mkdirSync(certDestDir, { recursive: true });

const certMap = {
  'certifcate.png': 'cert1.png',
  'certifcate2.png': 'cert2.png',
  'certifcate3.png': 'cert3.png',
  'certificate 4.jpeg': 'cert4.jpeg'
};

Object.entries(certMap).forEach(([oldName, newName]) => {
  const sourcePath = path.join(sourceDir, oldName);
  if (fs.existsSync(sourcePath)) {
    fs.copyFileSync(sourcePath, path.join(certDestDir, newName));
    console.log(`Copied certificate: ${oldName} -> ${newName}`);
  }
});

console.log(`Successfully copied ${movedCount} images to the public/sequence folder!`);
console.log('You can now check the website in your browser.');
