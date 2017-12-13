export const DEFAULT_SHADER_CODE = require('./shader.frag');
export const DEFAULT_SHADER = {
  id: '0',
  name: 'melt-internet',
  code: DEFAULT_SHADER_CODE,
  blend: 'difference',
};

export const EMPTY_SHADER_CODE = `
precision mediump float;
uniform float time;
uniform vec2 resolution;
uniform sampler2D image;

void main() {
  vec2 uv = gl_FragCoord.xy / resolution;
  gl_FragColor = 1. - texture2D(image, uv);
}
`.trim();
