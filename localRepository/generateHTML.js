import fs from 'fs';
import { replaceHTMLSymbols } from './helpers/replaceSymbols.js';
import { parseTemplate } from './templateParser.js';
import File from './components/File.js';
import Folder from "./components/Folder.js";
import Preview from "./components/Preview.js";
import styles from './styles.css';
import {
    $,fileClickEvent, folderClickEvent,
    init, switchStateOfListenedElement, toogleView,
    storeElementData,
} from './behavior.js';
import {
  destinationFolderSrc
} from './globalVariables.js';

const createTemplate = (children) => `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <title>Project structure</title>
    <link href="./prism/prism.css" rel="stylesheet" />
    <style>
      ${styles}
      .visible {
        display: block;
      }
      .invisible {
        display: none;
      }
    </style>
    <script type="text/javascript">
        var elements = ${JSON.stringify(global.dictOfElements)};
        console.log(JSON.parse(JSON.stringify(elements)));
        ${$}
        ${switchStateOfListenedElement}
        ${toogleView}
        ${init}
        init();
        ${folderClickEvent}
        ${fileClickEvent}
        ${storeElementData}
    </script>
  </head>
  <body>
    <section class="project">
        <div class="structure">
            ${children}
        </div>
        ${parseTemplate(Preview).template}
    </section>
    <script src="./prism/prism.js"></script>
  </body>
</html>`;

function createFileView(file) {
  const content = replaceHTMLSymbols(file.content);
  return parseTemplate(
      {
        ...File,
        title: file.title,
        content,
        extension: file.extension.match(/(\w+)/)[0],
      },
  ).template || '';
}

function createFolderView(folder) {
  const files = folder.files.map((file) => {

    if(file.type === 'file') return createFileView(file); //replace(createFileView(file),/"\n "/gm, '<br/>');
    if(file.type === 'folder') return createFolderView(file);
  }).join('');
  return parseTemplate({
      ...Folder,
      title: folder.title || 'root',
      files: files,
  }).template;
}

function createFolder() {
  if(!fs.existsSync(destinationFolderSrc)) {
    fs.mkdirSync(destinationFolderSrc);
  }
}

function copyRequiredFilesIntoDestinationFolder() {
  fs.cpSync('./prism', `${destinationFolderSrc}/prism`, {recursive: true});
  fs.cpSync('./public', `${destinationFolderSrc}/public`, {recursive: true});
}

export default async function generateHTML(structure) {
  createFolder();
  copyRequiredFilesIntoDestinationFolder();
  const generated = createTemplate(createFolderView(structure));    
  const fileSrc = `${destinationFolderSrc}/structure.html`;
  fs.writeFileSync(fileSrc, generated, (err) => {console.error(err)});
}
