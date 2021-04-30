const fs = require('fs');

exports.getBackgroundImage = () => {
  const files = fs.readdirSync('public/image');
  let background = '';
  for (const file of files) {
    if (file.startsWith('background')) {
      background = file;
    }
  }
  return background;
};
