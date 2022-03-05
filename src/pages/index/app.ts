/**
 * @author 成雨
 * @date 2022/2/27
 * @Description:
 */
import WebGLView from '../../webgl/WebGlView';

class App {
    private webgl!: WebGLView;

    constructor() {
        this.init();
    }

    init() {
        this.initWebGL();
        this.addListeners();
        this.animate();
    }

    initWebGL() {
        this.webgl = new WebGLView();
        document.querySelector('.container')?.appendChild(this.webgl.renderer.domElement);
    }

    addListeners() {
        window.addEventListener('resize', this.resize.bind(this));
    }

    animate() {
        this.update();
        this.draw();
        requestAnimationFrame(this.animate.bind(this));
    }

    update() {
        if (this.webgl) this.webgl.update();
    }

    draw() {
        if (this.webgl) this.webgl.draw();
    }

    resize() {
        if (this.webgl) this.webgl.resize();
    }
}

export default App;
