import {
    Mesh,
    Object3D,
    Texture,
    Vector2,
    TextureLoader,
    RawShaderMaterial,
    InstancedBufferGeometry,
    BufferAttribute,
    InstancedBufferAttribute,
    PlaneGeometry,
    MeshBasicMaterial,
    LinearFilter
} from 'three';
// @ts-ignore
// import glsl from 'glslify';
import { TweenLite } from 'gsap/TweenMax';
import WebGLView from '../WebGlView';
import TouchTexture from './TouchTexture';
import particleVert from '../../shaders/particle.vert';
import particleFrag from '../../shaders/particle.frag';

/**
 * @author 成雨
 * @date 2022/2/27
 * @Description:
 */

class Particles {
    public texture?: Texture;
    public width!: number;
    public height!: number;

    public container: Object3D;

    private numPoints!: number;
    private webgl: WebGLView;
    private object3D!: Mesh<InstancedBufferGeometry, RawShaderMaterial>;
    private hitArea!: Mesh<PlaneGeometry, MeshBasicMaterial>;
    private touch?: TouchTexture;

    constructor(webgl: WebGLView) {
        this.webgl = webgl;
        this.container = new Object3D();
    }

    async init(src: string) {
        const loader =  new TextureLoader();
        this.texture = await loader.loadAsync(src);

        this.texture.minFilter = LinearFilter;
        this.texture.magFilter = LinearFilter;
        // this.texture.format = RGBFormat;

        this.width = this.texture.image.width;
        this.height = this.texture.image.height;

        this.initPoints(true);
        this.initHitArea();
        // this.initTouch();
        this.show();
    }

    initPoints(discard: boolean) {
        this.numPoints = this.width * this.height;

        let numVisible = this.numPoints;
        let threshold = 0;
        let originalColors;

        if (discard) {
            numVisible = 0;
            threshold = 34;

            const img = this.texture?.image;
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');

            if (ctx) {
                canvas.width = this.width;
                canvas.height = this.height;

                ctx.scale(1, -1);
                ctx.drawImage(img, 0, 0, this.width, this.height * -1);

                // document.querySelector('#particle')?.append(canvas);
                // 像素数据
                // https://developer.mozilla.org/zh-CN/docs/Web/API/Canvas_API/Tutorial/Pixel_manipulation_with_canvas
                const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                // imgData.data 每个像素点的rgba值
                originalColors = Float32Array.from(imgData.data);

                for (let i = 0; i < this.numPoints; i++) {
                    // 只显示"rgba"中"r"大于threshold的像素点
                    if (originalColors[i * 4] > threshold) numVisible++;
                }
            }
        }

        const uniforms = {
            uTime: { value: 0 },
            uRandom: { value: 1.0 },
            uDepth: { value: 2.0 },
            uSize: { value: 0.0 },
            // Vector2 二维向量
            uTextureSize: { value: new Vector2(this.width, this.height) },
            uTexture: { value: this.texture },
            uTouch: { value: null },
        };

        // 原始着色器材质
        const material = new RawShaderMaterial({
            uniforms,
            vertexShader: particleVert,
            fragmentShader: particleFrag,
            depthTest: false,
            transparent: true,
        })

        // 几何体
        const geometry = new InstancedBufferGeometry();

        const positions = new BufferAttribute(new Float32Array(4 * 3), 3);
        positions.setXYZ(0, -0.5,  0.5,  0.0);
        positions.setXYZ(1,  0.5,  0.5,  0.0);
        positions.setXYZ(2, -0.5, -0.5,  0.0);
        positions.setXYZ(3,  0.5, -0.5,  0.0);
        geometry.setAttribute('position', positions);

        // uvs
        const uvs = new BufferAttribute(new Float32Array(4 * 2), 2);
        uvs.setXY(0,  0.0,  0.0);
        uvs.setXY(1,  1.0,  0.0);
        uvs.setXY(2,  0.0,  1.0);
        uvs.setXY(3,  1.0,  1.0);
        geometry.setAttribute('uv', uvs);

        // index 设置缓存的index
        geometry.setIndex(new BufferAttribute(new Uint16Array([ 0, 2, 1, 2, 3, 1 ]), 1));

        const indices = new Uint16Array(numVisible);
        // 计算出偏移量
        const offsets = new Float32Array(numVisible * 3);
        const angles = new Float32Array(numVisible);

        for (let i = 0, j = 0; i < this.numPoints; i++) {
            if (discard && originalColors && originalColors[i * 4] <= threshold) continue;

            // 求余 算出 x 值
            offsets[j * 3] = i % this.width;
            // 计算出 y 值
            offsets[j * 3 + 1] = Math.floor(i / this.width);

            indices[j] = i;

            angles[j] = Math.random() * Math.PI;

            j++;
        }

        console.log('indices', indices);
        geometry.setAttribute('pindex', new InstancedBufferAttribute(indices, 1, false));
        console.log('offsets', offsets);
        geometry.setAttribute('offset', new InstancedBufferAttribute(offsets, 3, false));
        geometry.setAttribute('angle', new InstancedBufferAttribute(angles, 1, false));

        this.object3D = new Mesh(geometry, material);
        this.container.add(this.object3D);
    }

    initTouch() {
        // create only once
        if (!this.touch) this.touch = new TouchTexture(this);
        this.object3D.material.uniforms.uTouch.value = this.touch.texture;
    }

    initHitArea() {
        const geometry = new PlaneGeometry(this.width, this.height, 1, 1);
        const material = new MeshBasicMaterial({ color: 0xFFFFFF, wireframe: true, depthTest: false });
        material.visible = false;
        this.hitArea = new Mesh(geometry, material);
        this.container.add(this.hitArea);
    }

    update(delta: number) {
        if (!this.object3D) return;
        // if (this.touch) this.touch.update();

        this.object3D.material.uniforms.uTime.value += delta;
    }

    show(time = 2.0) {
        // reset
        TweenLite.fromTo(this.object3D.material.uniforms.uSize, time, { value: 0.5 }, { value: 1.5 });
        TweenLite.to(this.object3D.material.uniforms.uRandom, time, { value: 2.0 });
        TweenLite.fromTo(this.object3D.material.uniforms.uDepth, time * 1.5, { value: 40.0 }, { value: 4.0 });

        // this.addListeners();
    }
}

export default Particles;
