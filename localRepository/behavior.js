export function $(selector) {
    return document.querySelector(selector);
}

export function storeElementData(elementId, data) {
    if(!elements in global) {
        global.elements = {}
    }
    global.elements[elementId] = data;

}

export function switchStateOfListenedElement(elementId) {
    if(elementId in listenedElements) {
        listenedElements[elementId] = !listenedElements[elementId];
    } else {
        listenedElements[elementId] = false;
    }

    return listenedElements[elementId];
}

export function toogleView(element, id) {
    const isVisible = !switchStateOfListenedElement(id);
    if (isVisible) {
        element.classList.add('visible');
        element.classList.remove('invisible');
    } else {
        element.classList.add('invisible');
        element.classList.remove('visible');
    }
}


export function folderClickEvent(elementId) {
    const files = $(`#${elementId} > .files`);
    toogleView(files, elementId);

}

export function fileClickEvent(elementId) {
    console.log("clickEvent", elements[elementId]);
    const preview = $('.preview');
    preview.innerHTML = elements[elementId];
    window.Prism.highlightAll(preview);
}

export function init() {
    window.listenedElements = {};
}