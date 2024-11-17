const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const processDirectory = async (directory) => {
    const files = fs.readdirSync(directory);
    
    // Create thumbnails directory if it doesn't exist
    const thumbnailsDir = path.join(directory, 'thumbnails');
    if (!fs.existsSync(thumbnailsDir)) {
        fs.mkdirSync(thumbnailsDir);
    }

    for (const file of files) {
        if (file.match(/\.(jpg|jpeg|png|gif)$/i)) {
            await sharp(path.join(directory, file))
                .resize(500) // Adjust size as needed
                .jpeg({ quality: 30 })
                .toFile(path.join(thumbnailsDir, file));
        }
    }
};

// Process all feature showcase directories
const featuresDir = './public/assets/features_showcase';
const directories = fs.readdirSync(featuresDir);
directories.forEach(dir => {
    const fullPath = path.join(featuresDir, dir);
    if (fs.statSync(fullPath).isDirectory()) {
        processDirectory(fullPath);
    }
}); 