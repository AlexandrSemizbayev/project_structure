/*  This file helps us to parse template files
input:
----------------
<div class=file>
  <span class="file-name" @click="toogleView('{{arg}}')">
    {{ title }}
  </span>
  <pre>
    <code id="{{ id }}">
      {{ content }}
    </code>
  </pre>
</div>
----------------

desired output:
----------------
<div class=file>
  <span class="file-name" onclick="toogleView('parsedArgument')">
    Parsed title
  </span>
  <pre>
    <code id="element-123">
      Parsed content
    </code>
  </pre>
</div>
----------------
*/
let countAsId = 1;

const nonWhiteSpaceChars = '\\S+';  // double backslash is required for new RegExp(regex), since we are passing a string;
const additionalAttributes = {  // keys have RegExp based naming
  [`@click="${nonWhiteSpaceChars}"`]: (callback) => `onclick="${callback}"`,
  [`@change="[${nonWhiteSpaceChars}]"`]: (callback) => `onchange="${callback}"`,
}

const strictMode = !!process.env.IS_STRICT;

const throwException = (reason, template) => {
  const message = `${reason} was not passed in ${template}, ${process.cwd()}`;
  if(strictMode) throw Error(message);
  else console.warn(message);
}

export const parseTemplate = (data) => {
  let { template } = data;
  data.id = `el${countAsId}`;
  countAsId++;
  delete data[template];

  const valuesToReplace = template.match(/\{\{\s*([^\s{}]+)\s*\}\}/gm);  // matching all values enclosed in {{ * }};
  const filteredDictOfValues = {};
  valuesToReplace?.forEach((val) => {
    filteredDictOfValues[val]=true;
  });
  const filteredValues = Object.keys(filteredDictOfValues);
  filteredValues.forEach((scopedValue,idx) => {
    const matchedValue = scopedValue.match(/[^\s{}]+/);  // matching all non-white-space chars within {{ * }};
    if(matchedValue) { // may result null
      if(!matchedValue[0] in data) throwException(matchedValue[0], template); // throw exception, if not presented in data;
      template = template.replaceAll(scopedValue, data[matchedValue[0]]);  // replacing {{ * }} to passed value;
    }
  });
  Object.keys(additionalAttributes).forEach((attr) => { // 
    const regexp = new RegExp(attr, 'gm');
    const match = template.match(regexp); // getting whole attribute, like @click="toogleView"
    if(match) {
      match.forEach((matchedAttr) => {
        const val = matchedAttr.match(/"([^"]*)"/gm); // matching everything enclosed in double quotes a-la "toogleView"
        if(val) {
          const parameter = val[0].replace(/"/gm,''); // replacing ": '"toogleView"' -> 'toogleView'
          if(!parameter in data) throwException(parameter, template);
          template = template.replace(matchedAttr, additionalAttributes[attr](parameter));
        }
      });
    }
  });
  if(data.generated) {
    data.generated();
    delete data.generated;
  }
  return {
    ...data,
    template,
  };
}

export const mountTemplate = (target, component) => {
  target.innerHTML = component.template;
  window.requestAnimationFrame(() => {
    if(component.mounted) {
      component.mounted();
    }
  });
}