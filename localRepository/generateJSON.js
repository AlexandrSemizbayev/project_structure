import fs from 'fs';

import {destinationFolderSrc} from './globalVariables.js';

export default function generateJSON() {
  const startPath = '..';
  const filesToExclude = [
    'package-lock.json','.gitignore',
    'node_modules', 'structure.html',
    'structure.json', '.git', '.idea', '.env',
    'prism','.DS_Store',
  ];
  const excludeFiles = {};

  filesToExclude.forEach(fileName => {
    excludeFiles[fileName] = true;
  });

  const skipThisExtensions = ['jpg','jpeg','png','bmp','mp3','mp4','mpeg','pem','base64'];
  const extensionsToSkip = {};

  skipThisExtensions.forEach((extension) => {
    extensionsToSkip[`.${extension}`] = true;
  })

  const generateExcluded = (fileName, path = '') => ({
    type: 'excluded',
    title: fileName,
    path,
  })

  const generateFile = (fileName, content) => {
    const extension = fileName.match(/\.\w+/gm);
    return {
      type: 'file',
      title: fileName,
      content: content,
      extension: extension[extension.length - 1] || 'html',
    };
};

  const generateFolder = (path = './', folderName = '') => {
    const files = ls(`${path}${folderName}/`);
    return {
      type: 'folder',
      title: folderName,
      files,
    };
  };


  function defineType(fileName, path) {
    if(fileName.match(/[\w|\-|_]+\.\w+/gm)) {
      return open(fileName, path);
    } else {
      return generateFolder(path, fileName);
    }
  }

  function open(fileName, path) {
    const fileContent = fs.readFileSync(path+fileName, { encoding: 'utf-8', flag: 'r'});
    return generateFile(fileName, fileContent);
  }

  function ls(path = '.') {
    const files = fs.readdirSync(path,{ withFileTypes: true });
    const result = files.map((file) => {
      if(!excludeFiles[file.name]) {
        const extension = file.name.match(/\.\w+/gm);
        if(extension && extensionsToSkip[extension[extension.length - 1]]) {
          return generateExcluded(file.name, path+file.name);
        }
        const result = defineType(file.name, path);
        return result;
      } else {
        return generateExcluded(file.name);
      }
    });
    return result;
  }
  const root = generateFolder(startPath);
  fs.writeFile(`${destinationFolderSrc}/structure.json`, JSON.stringify(root),(err) => {console.error(err)});
  return root;
}