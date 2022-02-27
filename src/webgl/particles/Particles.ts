import { TextureLoader, Texture } from 'three';
import WebGLView from '../WebGlView';

/**
 * @author 成雨
 * @date 2022/2/27
 * @Description:
 */

class Particles {
    public texture?: Texture;

    private webgl: WebGLView;
    private width?: number;
    private height?: number;
    
    constructor(webgl: WebGLView) {
        this.webgl = webgl;
    }

    async init(src: string) {
        const loader =  new TextureLoader();
        this.texture = await loader.loadAsync(src);

        // this.texture.minFilter = THREE.LinearFilter;
        // this.texture.magFilter = THREE.LinearFilter;
        // this.texture.format = THREE.RGBFormat;

        this.width = this.texture.image.width;
        this.height = this.texture.image.height;
    }
}

export default Particles;
