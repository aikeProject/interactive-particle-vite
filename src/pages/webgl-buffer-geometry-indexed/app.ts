/**
 * @author 成雨
 * @date 2022/3/5
 * @Description: BufferGeometry
 * https://threejs.org/docs/index.html?q=InstancedBufferGeometry#api/zh/core/BufferGeometry
 * https://github.com/mrdoob/three.js/blob/master/examples/webgl_buffergeometry_indexed.html
 */

import {
    PerspectiveCamera,
    Scene,
    Color,
    HemisphereLight,
    BufferGeometry,
    Float32BufferAttribute,
    MeshPhongMaterial,
    DoubleSide,
    Mesh,
    WebGLRenderer
} from 'three';

let camera: PerspectiveCamera, scene: Scene, renderer: WebGLRenderer;

let mesh: Mesh;

function init() {
    camera = new PerspectiveCamera( 27, window.innerWidth / window.innerHeight, 1, 3500 );
    camera.position.z = 64;

    scene = new Scene();
    scene.background = new Color( 0x050505 );
    
    const light = new HemisphereLight();
    scene.add( light );
    
    const geometry = new BufferGeometry();

    const indices = [];

    const vertices = [];
    const normals = [];
    const colors = [];

    const size = 20;
    const segments = 10;

    const halfSize = size / 2;
    const segmentSize = size / segments;

    // generate vertices, normals and color data for a simple grid geometry

    for ( let i = 0; i <= segments; i ++ ) {

        const y = ( i * segmentSize ) - halfSize;

        for ( let j = 0; j <= segments; j ++ ) {

            const x = ( j * segmentSize ) - halfSize;

            vertices.push( x, - y, 0 );
            normals.push( 0, 0, 1 );

            const r = ( x / size ) + 0.5;
            const g = ( y / size ) + 0.5;

            colors.push( r, g, 1 );

        }

    }

    // generate indices (data for element array buffer)

    for ( let i = 0; i < segments; i ++ ) {

        for ( let j = 0; j < segments; j ++ ) {

            const a = i * ( segments + 1 ) + ( j + 1 );
            const b = i * ( segments + 1 ) + j;
            const c = ( i + 1 ) * ( segments + 1 ) + j;
            const d = ( i + 1 ) * ( segments + 1 ) + ( j + 1 );

            // generate two faces (triangles) per iteration

            indices.push( a, b, d ); // face one
            indices.push( b, c, d ); // face two

        }

    }

    geometry.setIndex( indices );
    console.log('vertices', vertices);
    geometry.setAttribute( 'position', new Float32BufferAttribute( vertices, 3 ) );
    console.log('normal', normals);
    geometry.setAttribute( 'normal', new Float32BufferAttribute( normals, 3 ) );
    console.log('color', colors);
    geometry.setAttribute( 'color', new Float32BufferAttribute( colors, 3 ) );

    const material = new MeshPhongMaterial( {
        side: DoubleSide,
        vertexColors: true,
        wireframe: true
    } );

    mesh = new Mesh( geometry, material );
    scene.add( mesh );

    renderer = new WebGLRenderer( { antialias: true } );
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );
    document.querySelector('.container')?.appendChild(renderer.domElement);


    window.addEventListener( 'resize', onWindowResize );

}

function onWindowResize() {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize( window.innerWidth, window.innerHeight );

}

//

function animate() {

    requestAnimationFrame( animate );

    render();

}

function render() {

    // const time = Date.now() * 0.001;
    // mesh.rotation.x = time * 0.25;
    // mesh.rotation.y = time * 0.5;

    renderer.render( scene, camera );
}

function App() {
    init();
    animate();
}

export default App;
