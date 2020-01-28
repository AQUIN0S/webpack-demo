import _ from 'lodash';
import './style.css';
import Cliffside from './assets/images/Cliffside.jpg';
import Data from './data.xml';

function component() {
  const element = document.createElement('div');

  element.innerHTML = _.join(['Hello', 'webpack'], ' ');
  element.classList.add('hello');

  // Adding image element
  const myImage = new Image(500, 500);
  myImage.src = Cliffside;

  // Adding generic element with an image background defined in css
  const imageWrapper = document.createElement('div');
  imageWrapper.classList.add("imageWrapper");

  // Adding font
  const starWarsHeader = document.createElement('h2');
  starWarsHeader.classList.add("starWarsHeader");
  starWarsHeader.appendChild(document.createTextNode("Testing font"));

  element.appendChild(document.createElement("br"));
  element.appendChild(imageWrapper);
  element.appendChild(myImage);
  element.appendChild(starWarsHeader);

  console.log(Data);

  return element;
}

document.body.appendChild(component());
