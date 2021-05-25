import * as THREE from "three";
import { FireShader } from "./FireShader";

const Fire = function ( fireTex, color ) {

	var fireMaterial = new THREE.ShaderMaterial( {
        defines         : FireShader.defines,
        uniforms        : THREE.UniformsUtils.clone( FireShader.uniforms ),
        vertexShader    : FireShader.vertexShader,
        fragmentShader  : FireShader.fragmentShader,
		transparent     : true,
		depthWrite      : false,
        depthTest       : false
	} );

    // initialize uniforms 

    fireTex.magFilter = fireTex.minFilter = THREE.LinearFilter;
    fireTex.wrapS = fireTex.wrapT = THREE.ClampToEdgeWrapping;
    
    fireMaterial.uniforms.fireTex.value = fireTex;
    fireMaterial.uniforms.color.value = color || new THREE.Color( 0xeeeeee );
    fireMaterial.uniforms.invModelMatrix.value = new THREE.Matrix4();
    fireMaterial.uniforms.scale.value = new THREE.Vector3( 5, 5, 5 );
    fireMaterial.uniforms.seed.value = Math.random() * 19.19;

	THREE.Mesh.call( this, new THREE.BoxGeometry( 0.5, 0.5, 0.5 ), fireMaterial );
};

Fire.prototype = Object.create( THREE.Mesh.prototype );
Fire.prototype.constructor = Fire;

Fire.prototype.update = function ( time ) {

    var invModelMatrix = this.material.uniforms.invModelMatrix.value;

    this.updateMatrixWorld();
    invModelMatrix.copy( this.matrixWorld ).invert();

    if( time !== undefined ) {
        this.material.uniforms.time.value = time;
    }

    this.material.uniforms.invModelMatrix.value = invModelMatrix;

    this.material.uniforms.scale.value = this.scale;

};

export default Fire;