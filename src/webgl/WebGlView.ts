/**
 * @author 成雨
 * @date 2022/2/27
 * @Description:
 */

import { Scene, PerspectiveCamera, WebGLRenderer, Clock, MeshBasicMaterial, Mesh, PlaneGeometry } from 'three';
import Particles from './particles/Particles';

class WebGLView {
    scene!: Scene;
    camera!: PerspectiveCamera;
    renderer!: WebGLRenderer;
    clock!: Clock;
    particles!: Particles;

    constructor() {
        this.initThree();
        this.initParticles();
    }

    /**
     * 初始化three
     */
    initThree() {
        // scene
        this.scene = new Scene();

        // camera
        this.camera = new PerspectiveCamera(50, window.innerWidth / window.innerHeight, 1, 10000);
        this.camera.position.z = 300;

        this.scene.add(this.camera);

        // renderer
        this.renderer = new WebGLRenderer({ antialias: true, alpha: true });

        // clock
        this.clock = new Clock(true);
    }

    /**
     * 初始化图片粒子
     */
    async initParticles() {
        this.particles = new Particles(this);
        await this.particles.init('images/sample-01.png');

        const img = new MeshBasicMaterial({
            map: this.particles.texture
        });

        // plane
        const plane = new Mesh(new PlaneGeometry(200, 200), img);
        this.scene.add(plane);
    }

    draw() {
        this.renderer.render(this.scene, this.camera);
    }

    update() {
        // nothing
    }
}

export default WebGLView;


