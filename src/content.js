/* @flow */
import Veda from 'vedajs';
import Store from './store';

const ID = 'XXXPOSTINTERNETXXX';

if (!window._____veda) {
  window._____veda = new Veda({});
}
const veda = window._____veda;

if (!window._____store) {
  window._____store = new Store();
}
const store = window._____store;

const resize = () => {
  veda.resize(window.innerWidth, window.innerHeight);
}

window.chrome.runtime.onMessage.addListener(msg => {
  const body = document.body;
  if (!body) { return; }

  if (msg.type === 'postinternet:load') {
    let canvas = document.getElementById(ID);
    if (canvas) {
      veda.stop();
      veda.loadTexture('image', msg.imageUrl);
      veda.play();
    } else {
      canvas = document.createElement('canvas');
      canvas.id = ID;
      canvas.style.position = 'fixed';
      canvas.style.zIndex = '9999';
      canvas.style.top = '0px';
      canvas.style.left = '0px';
      canvas.style.width = '100%';
      canvas.style.height = '100%';
      canvas.style.background = 'transparent';
      canvas.style.pointerEvents = 'none';
      canvas.style.margin = '0';
      canvas.style.padding = '0';
      canvas.style.opacity = '0.5';
      // canvas.style.mixBlendMode = 'difference';

      body.appendChild(canvas);

      window.addEventListener('resize', resize);

      veda.loadTexture('image', msg.imageUrl);
      veda.setCanvas(canvas);
      veda.loadFragmentShader(msg.shader.code);
      veda.play();
    }
  } else if (msg.type === 'postinternet:unload') {
    window.removeEventListener('resize', resize);
    veda.stop();
    const canvas = document.getElementById(ID);
    if (canvas) {
      body.removeChild(canvas);
    }
  }
});
