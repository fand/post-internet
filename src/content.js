import Veda from 'vedajs';
import shader from './shader.frag';
const ID = 'XXXPOSTINTERNETXXX';

if (!window.veda) {
  window.veda = new Veda();
}
const veda = window.veda;

const resize = () => {
  veda.resize(window.innerWidth, window.innerHeight);
}

chrome.runtime.onMessage.addListener(msg => {
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
      canvas.style.mixBlendMode = 'difference';

      document.body.appendChild(canvas);

      window.addEventListener('resize', resize);

      veda.loadTexture('image', msg.imageUrl);
      veda.setCanvas(canvas);
      veda.loadFragmentShader(shader);
      veda.play();
    }
  } else if (msg.type === 'postinternet:unload') {
    window.removeEventListener('resize', resize);
    veda.stop();
    let canvas = document.getElementById(ID);
    document.body.removeChild(canvas);
  }
});
