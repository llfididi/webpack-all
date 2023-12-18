import createHeading from './heading.js';

import './main.css'

import icon from './icon.png'

import footerHtml from './footer.html'
import about from './about.md'


const heading = createHeading();

document.body.append(heading);




const img = new Image()
img.src = icon

document.body.append(img)

document.write(footerHtml)

document.write(about)
console.log(about)