/**
 * @author 成雨
 * @date 2022/2/27
 * @Description:
 */

// @ts-ignore
import { Scene, PerspectiveCamera, WebGLRenderer, Clock } from 'three';
import App from '../App'

class WebGLView {
    scene: Scene;
    camera: PerspectiveCamera;
    renderer: WebGLRenderer;
    clock: Clock;

    constructor(app: App) {
        this.initThree();
    }

    initThree() {
        // scene
        this.scene = new Scene();

        // camera
        this.camera = new PerspectiveCamera(50, window.innerWidth / window.innerHeight, 1, 10000);
        this.camera.position.z = 300;

        // renderer
        this.renderer = new WebGLRenderer({ antialias: true, alpha: true });

        // clock
        this.clock = new Clock(true);
    }
}

export default WebGLView;


