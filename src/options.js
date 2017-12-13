/* @flow */
import React from 'react';
import ReactDOM from 'react-dom';
import styled from 'styled-components';
import {UnControlled as CodeMirror} from 'react-codemirror2';
require('codemirror/mode/clike/clike');
require('codemirror/lib/codemirror.css');
require('codemirror/theme/dracula.css');
import Veda from 'vedajs';
import Store from './store';
import type { Shader, Shaders } from './store';
import { debounce } from 'lodash';
import { DEFAULT_SHADER, DEFAULT_SHADER_CODE, EMPTY_SHADER_CODE } from './constants';

const Wrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-content: start;
  color: white;
  background: rgba(0, 0, 30, 0.5);
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 2;
  h1 {
    display: block;
    width: 100%;
    height: 1em;
    margin: 20px;
  }
`;
const Sidebar = styled.div`
  min-width: 120px;
  margin: 0 20px;
  flex: 0;
  ul {
    padding-left: 20px;
  }
  li {
    list-style: none;
    cursor: pointer;
    text-decoration: underline;
  }
`;
const Content = styled.div`
  flex: 1;
  margin: 0 20px;
  button {
    margin-right: 10px;
    &[disabled] {
      opacity: 0.3;
    }
  }
`;
const Canvas = styled.canvas`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
  background: black;
`;

type IState = {
  shaders: Shaders;
  shader: Shader;
  activeShaderId: string;
}

class App extends React.Component<any, IState> {
  veda: Veda;
  canvas: HTMLCanvasElement;

  store = new Store();
  state = {
    shaders: {},
    shader: DEFAULT_SHADER,
    activeShaderId: DEFAULT_SHADER.id,
  };

  componentDidMount() {
    const shaders = this.store.getShaders();
    const shader = this.store.getActiveShader();
    this.setState({
      shaders, shader,
      activeShaderId: shader.id
    });

    this.veda = new Veda({});
    this.veda.loadTexture('image', './images/river.jpg');
    this.veda.setCanvas(this.canvas);
    this.veda.loadFragmentShader(shader.code);
    this.veda.play();

    window.addEventListener('resize', this.onResize);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.onResize);
  }

  onResize = () => {
    this.veda.resize(window.innerWidth, window.innerHeight);
  }

  onCodeChange = (editor, data, code) => {
    if (!code) { return; }
    this.setState({ shader: { ...this.state.shader, code } });
    this.loadShader(code);
  }

  loadShader = debounce((code) => {
    this.veda.loadFragmentShader(code);
  }, 100);

  onNameChange = (e) => {
    this.setState({ shader: { ...this.state.shader, name: e.target.value } });
  }

  setCanvas = (el) => {
    this.canvas = el;
  }

  add = () => {
    const shader = {
      id: Date.now().toString(),
      name: `effect ${Object.keys(this.state.shaders).length}`,
      code: EMPTY_SHADER_CODE,
    };
    this.store.save(shader);
    const shaders = this.store.getShaders();
    this.setState({ shaders, shader });
  }

  save = () => {
    this.store.save(this.state.shader);
    const shaders = this.store.getShaders();
    this.setState({ shaders });
  }

  delete = () => {
    if (window.confirm(`Delete "${this.state.shader.name}"?`)) {
      this.store.delete(this.state.shader);
      const shaders = this.store.getShaders();
      this.setState({
        shaders,
        shader: DEFAULT_SHADER,
        activeShaderId: DEFAULT_SHADER.id,
      });
    }
  }

  useThis = () => {
    this.store.useThis(this.state.shader);
    this.setState({ activeShaderId: this.state.shader.id });
  }

  onSelect = (shader: Shader) => () => {
    this.setState({ shader });
  }

  render() {
    const shader = this.state.shader;
    return (
      <div>
        <Wrapper>
          <h1>post-internet</h1>
          <Sidebar>
            <h3>Effects</h3>
            <ul>
              {Object.keys(this.state.shaders).map(k => this.state.shaders[k]).map(s =>
                this.state.activeShaderId === s.id ?
                  <li key={s.id} onClick={this.onSelect(s)}><b>{s.name}</b></li> :
                  <li key={s.id} onClick={this.onSelect(s)}>{s.name}</li>
              )}
            </ul>
            <button onClick={this.add}>Add</button>
          </Sidebar>
          <Content>
            <p>
              name: <input
                type="text"
                value={shader.name}
                onChange={this.onNameChange}
              />
            </p>
            <CodeMirror
              value={shader.code}
              onChange={this.onCodeChange}
              autoFocus={true}
              autoCursor={false}
              options={{
                mode: 'clike',
                theme: 'dracula',
                lineNumbers: true,
              }}
            />
            <p>
              <button onClick={this.save}>Save</button>
              <button onClick={this.delete} disabled={this.state.shader.id === '0'}>Delete</button>
              <button onClick={this.useThis} disabled={this.state.activeShaderId === this.state.shader.id}>Use this</button>
            </p>
          </Content>
        </Wrapper>
        <Canvas innerRef={this.setCanvas}/>
      </div>
    );
  }
}


ReactDOM.render(<App/>, (document.getElementById('app'): any));
