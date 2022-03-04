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
    private fovHeight?: number;

    constructor() {
        this.initThree();
        void this.initParticles();
        this.resize();
    }

    /**
     * 初始化three
     */
    initThree() {
        // scene
        this.scene = new Scene();

        // camera
        // PerspectiveCamera透视摄像机
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
        await this.particles.init('images/sample-04.png');
        //
        // const img = new MeshBasicMaterial({
        //     map: this.particles.texture
        // });
        //
        // // plane
        // const plane = new Mesh(new PlaneGeometry(this.particles.width, this.particles.height), img);
        this.scene.add(this.particles.container);
    }

    draw() {
        this.renderer.render(this.scene, this.camera);
    }

    update() {
        const delta = this.clock.getDelta();

        if (this.particles) this.particles.update(delta);
    }

    resize() {
        if (!this.renderer) return;
        this.camera.aspect = window.innerWidth / window.innerHeight;
        // 属性变化之后，调用updateProjectionMatrix使其生效
        this.camera.updateProjectionMatrix();

        this.fovHeight = 2 * Math.tan((this.camera.fov * Math.PI) / 180 / 2) * this.camera.position.z;

        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }
}

export default WebGLView;


