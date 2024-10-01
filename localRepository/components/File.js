const template = `
  <div class="file" @click="fileClickEvent('{{ id }}')">
    <img src="./public/icons/{{ extension }}.png" alt="file-type" onerror="this.onerror=null;this.src='./public/icons/file.png'">
    <span class="file-name file-{{ id }}">
      {{ title }}
    </span>
  </div>
`;

const data = {
  id: 'el-1',
  title: '',
  content: '',
  extension: 'js',
  generated: function() {
    global.dictOfElements[this.id] = `
      <pre id="${this.id}"><code class="language-${this.extension}" style="white-space: pre-wrap;">${this.content}</code></pre>
    `
  },
  template,
};

export default data;