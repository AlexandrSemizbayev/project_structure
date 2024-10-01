const template = `<div class="folder" id={{id}}>
    <div class="folder-top" @click="folderClickEvent('{{id}}')">
        <img src="./public/icons/folder.png" alt="folder">
        <span class="folder-name">{{ title }}</span>
    </div>
    <div class="invisible files">{{files}}</div>
</div>`

const data = {
    id: 'folder-el-1',
    title: 'sample',
    files: '',
    template,
};

export default data;