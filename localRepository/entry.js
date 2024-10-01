import 'dotenv/config';
import fs from 'fs';
import generateHTML from './generateHTML.js';
import generateJSON from './generateJSON.js';
import {
    destinationFolderSrc
} from './globalVariables.js';

global.dictOfElements = {};

const mode = `to${process.env.MODE || 'HTML'}`;

function moveToProject() {
    if(fs.existsSync('../this_project_structure')) {
        fs.rmSync('../this_project_structure', {recursive: true});
    }
    fs.renameSync(
        destinationFolderSrc,
        '../this_project_structure',
    )
}

const actions = {
    toHTML: () => {
        const JSONStructure = actions.toJSON();
        generateHTML(JSONStructure);
        moveToProject();
    },
    toJSON: () => generateJSON(),
}

actions[mode]();