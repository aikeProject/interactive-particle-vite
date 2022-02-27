/**
 * @author 成雨
 * @date 2022/2/27
 * @Description:
 */
import WebGLView from './webgl/WebGlView';

class App {
    private webgl!: WebGLView;

    constructor() {
        this.init();
    }

    init() {
        this.initWebGL();
    }

    initWebGL() {
        this.webgl = new WebGLView(this);
        document.querySelector('.container')?.appendChild(this.webgl.renderer.domElement);
    }
}

export default App;
