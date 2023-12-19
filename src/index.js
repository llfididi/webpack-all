import createHeading from "./heading.js";

import "./main.css";

import icon from "./icon.png";

// import footerHtml from './footer.html'
import about from "./about.md";

const heading = createHeading();

document.body.append(heading);

const img = new Image();
img.src = icon;

document.body.append(img);

// document.write(footerHtml)

document.write(about);
console.log(about);

console.log(module.hot);

if (module.hot) {
  module.hot.accept("./heading.js", () => {
    console.log("editor 模块更新了，需要这里手动处理热替换逻辑");
  });
  module.hot.accept("./better.png", () => {
    img.src = background;
    console.log(background);
  });
}

const ul = document.createElement("ul");
document.body.append(ul);

fetch("/api/users") // http://localhost:8080/api/users
  .then((res) => res.json())
  .then((data) => {
    data.forEach((item) => {
      const li = document.createElement("li");
      li.textContent = item.login;
      ul.append(li);
    });
  });



  console.log(API_BASE_URL)




//   const render = () => {
//     const hash = window.location.hash || '#posts'
  
//     const mainElement = document.querySelector('.main')
  
//     mainElement.innerHTML = ''
  
//     if (hash === '#posts') {
//       // mainElement.appendChild(posts())
//       import(/* webpackChunkName: 'components' */'./posts/posts').then(({ default: posts }) => {
//         mainElement.appendChild(posts())
//       })
//     } else if (hash === '#album') {
//       // mainElement.appendChild(album())
//       // 下面这样注释生成的就是文件名了
//       import(/* webpackChunkName: 'components' */'./album/album').then(({ default: album }) => {
//         mainElement.appendChild(album())
//       })
//     }
//   }
  
//   render()
  
//   window.addEventListener('hashchange', render)