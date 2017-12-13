/* @flow */
const prefix = 'XXXPOSTINTERNETXXX';
import { DEFAULT_SHADER, DEFAULT_SHADER_CODE } from './constants';

type Shader = {
  id: string;
  name: string;
  code: string;
}
type Shaders = { [id: string]: Shader };

export default class Store {
  constructor() {
    const shaders = this._get('shaders');
    if (!shaders) {
      this._set('shaders', { '0': DEFAULT_SHADER });
    }

    const activeShaderId = this._get('activeShaderId');
    if (activeShaderId == null) {
      this._set('activeShaderId', DEFAULT_SHADER.id);
    }
  }

  getShaders(): Shaders {
    return this._get('shaders');
  }

  getActiveShader(): Shader {
    const shaders = this.getShaders();
    const activeShaderId = this._get('activeShaderId');
    return shaders[activeShaderId];
  }

  save(shader: Shader): void {
    const shaders = this.getShaders();
    this._set('shaders', {
      ...shaders,
      [shader.id]: shader,
    });
  }

  delete(shader: Shader): void {
    const shaders = this._get('shaders') || {};

    delete shaders[shader.id];
    if (Object.keys(shaders).length === 0) {
      shaders[DEFAULT_SHADER.id] = DEFAULT_SHADER;
    }
    this._set('shaders', shaders);

    const activeShaderId = this._get('activeShaderId');
    if (activeShaderId === shader.id) {
      this._set('activeShaderId', DEFAULT_SHADER.id);
    }
  }

  useThis(shader: Shader): void {
    this._set('activeShaderId', shader.id);
  }

  _get(key: string): any | null {
    try {
      const item = localStorage.getItem(prefix + key);
      if (item) {
        return JSON.parse(item);
      }
    } catch(e) {
      console.error(e);
    }
    return null;
  }

  _set(key: string, value: any): void {
    try {
      localStorage.setItem(prefix + key, JSON.stringify(value));
    } catch(e) {
      console.error(e);
    }
  }
}
