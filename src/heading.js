
import './editor.css'
export default () => {
    // const element = document.createElement('h2')
  
    // element.textContent = 'Hello world'
    // element.addEventListener('click', () => {
    //   alert('Hello webpack')
    // })
  
    // return element

    const editorElement = document.createElement('div')

    editorElement.contentEditable = true
    editorElement.className = 'editor'
    editorElement.id = 'ss'
  
    console.log('editor init completedsdd')
  
    return editorElement
  }