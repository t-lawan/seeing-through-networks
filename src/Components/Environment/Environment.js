import React, { Component } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { Colours } from "../Global/global.styles";
import { Curves } from "../../Utility/Curves";
import { Shader } from "../../Utility/Shader";
const style = {
  height: "100vh" // we can control scene size by setting container dimensions
};

class Environment extends Component {
  width;
  height;
  parent;
  tubeGeometry;
  mesh;
  cameraHelper;
  camPosIndex = 0;
  componentDidMount() {
    this.init();
    // this.addCustomSceneObjects();
    this.startAnimationLoop();
  }

  componentWillUnmount() {
    this.removeEventListeners();
    window.removeEventListener("resize", this.handleWindowResize);
    window.cancelAnimationFrame(this.requestID);
    this.controls.dispose();
  }

  init = () => {
    this.width = this.mount.clientWidth;
    this.height = this.mount.clientHeight;

    this.setupScene();
    this.setupCamera();
    this.setupControls();
    this.setupLights();
    this.setupSpline();
    this.parent = new THREE.Object3D();
    this.scene.add(this.parent);
    this.setupSplineCamera();
    this.setupCameraHelper();

    this.addTube();

    this.animateCamera();
    this.setupRenderer();
    this.addEventListeners();
    // this.clock = new THREE.Clock();
  };

  setupCamera = () => {
    this.camera = new THREE.PerspectiveCamera(
      50,
      this.width / this.height,
      0.01,
      10000
    );
    this.camera.position.set(0, 50, 500);
  };

  setupSplineCamera = () => {
    this.splineCamera = new THREE.PerspectiveCamera(
      50,
      this.width / this.height,
      0.01,
      500
    );
    this.parent.add(this.splineCamera);
  };

  setupCameraHelper = () => {
    this.cameraEye = new THREE.Mesh(
      new THREE.SphereGeometry(5),
      new THREE.MeshBasicMaterial({ color: 0xdddddd })
    );
    this.parent.add(this.cameraEye);
    this.cameraHelper = new THREE.CameraHelper(this.splineCamera);
    this.scene.add(this.cameraHelper);
  };

  setupControls = () => {
    this.controls = new OrbitControls(this.camera, this.mount);
    this.controls.autoRotate = true;
    this.controls.enabled = false;
  };

  setupRenderer = () => {
    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setClearColor(Colours.environment_background);

    this.renderer.setSize(this.width, this.height);
    this.mount.appendChild(this.renderer.domElement); // mount using React ref
  };

  // Standard scene setup in Three.js. Check "Creating a scene" manual for more information
  // https://threejs.org/docs/#manual/en/introduction/Creating-a-scene
  setupScene = () => {
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color("black");
    // this.scene.fog = new THREE.Fog(0xffffff, 1, 12);
  };

  setupLights = () => {
    const lights = [];
    lights[0] = new THREE.PointLight(0xffffff, 1, 0);
    lights[1] = new THREE.PointLight(0xffffff, 1, 0);
    lights[2] = new THREE.PointLight(0xffffff, 1, 0);

    lights[0].position.set(0, 200, 0);
    lights[1].position.set(100, 200, 100);
    lights[2].position.set(-100, -200, -100);

    this.scene.add(lights[0]);
    this.scene.add(lights[1]);
    this.scene.add(lights[2]);
  };

  setupSpline = () => {
    this.direction = new THREE.Vector3();
    this.binormal = new THREE.Vector3();
    this.normal = new THREE.Vector3();
    this.position = new THREE.Vector3();
    this.lookAt = new THREE.Vector3();

    this.spline = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, 10, -10),
      new THREE.Vector3(10, 0, -10),
      new THREE.Vector3(20, 0, 0),
      new THREE.Vector3(30, 0, 10),
      new THREE.Vector3(30, 0, 20),
      new THREE.Vector3(20, 0, 30),
      new THREE.Vector3(10, 0, 30),
      new THREE.Vector3(0, 0, 30),
      new THREE.Vector3(-10, 10, 30),
      new THREE.Vector3(-10, 20, 30),
      new THREE.Vector3(0, 30, 30),
      new THREE.Vector3(10, 30, 30),
      new THREE.Vector3(20, 30, 15),
      new THREE.Vector3(10, 30, 10),
      new THREE.Vector3(0, 30, 10),
      new THREE.Vector3(-10, 20, 10),
      new THREE.Vector3(-10, 10, 10),
      new THREE.Vector3(0, 0, 10),
      new THREE.Vector3(10, -10, 10),
      new THREE.Vector3(20, -15, 10),
      new THREE.Vector3(30, -15, 10),
      new THREE.Vector3(40, -15, 10),
      new THREE.Vector3(50, -15, 10),
      new THREE.Vector3(60, 0, 10),
      new THREE.Vector3(70, 0, 0),
      new THREE.Vector3(80, 0, 0),
      new THREE.Vector3(90, 0, 0),
      new THREE.Vector3(100, 0, 0)
    ]);

    this.splines = {
      GrannyKnot: new Curves.GrannyKnot(),
      HeartCurve: new Curves.HeartCurve(3.5),
      VivianiCurve: new Curves.VivianiCurve(70),
      KnotCurve: new Curves.KnotCurve(),
      HelixCurve: new Curves.HelixCurve(),
      TrefoilKnot: new Curves.TrefoilKnot(),
      TorusKnot: new Curves.TorusKnot(20),
      CinquefoilKnot: new Curves.CinquefoilKnot(20),
      TrefoilPolynomialKnot: new Curves.TrefoilPolynomialKnot(14),
      FigureEightPolynomialKnot: new Curves.FigureEightPolynomialKnot(),
      DecoratedTorusKnot4a: new Curves.DecoratedTorusKnot4a(),
      DecoratedTorusKnot4b: new Curves.DecoratedTorusKnot4b(),
      DecoratedTorusKnot5a: new Curves.DecoratedTorusKnot5a(),
      DecoratedTorusKnot5c: new Curves.DecoratedTorusKnot5c()
    };

    this.params = {
      spline: "GrannyKnot",
      scale: 8,
      extrusionSegments: 500,
      radiusSegments: 10,
      closed: true,
      animationView: false,
      lookAhead: false,
      cameraHelper: false
    };

    this.material = new THREE.MeshLambertMaterial({ 
        color: new THREE.Color(0x79a6bc),
        transparent: false,
        side: THREE.DoubleSide
    });
    
    
    //   let uniforms = {
    //   uTime: { value: 0.0 },
    //   uResolution: { value: { x: this.width, y:this.height } },
    //   uColor: { value: new THREE.Color(0x79a6bc) }
    // }

    // this.material = new THREE.ShaderMaterial({
    //   uniforms: uniforms,
    //   fragmentShader: Shader.fragment(),
    //   vertexShader: Shader.vertex()
    // })


  //   this.wireframeMaterial = new THREE.MeshBasicMaterial({
  //     color: 0x79a6bc,
  //     opacity: 1.0,
  //     wireframe: true,
  //     transparent: false,
  //   });
  };

  addTube() {
    if (this.mesh !== undefined) {
      this.parent.remove(this.mesh);
      this.mesh.geometry.dispose();
    }

    const extrudePath = this.splines[this.params.spline];

    this.tubeGeometry = new THREE.TubeGeometry(
      extrudePath,
      this.params.extrusionSegments,
      2,
      this.params.radiusSegments,
      this.params.closed
    );

    this.addGeometry(this.tubeGeometry);

    this.setScale();

    const geometry = new THREE.BoxGeometry(5, 5, 5);
    const material = new THREE.MeshPhongMaterial( {
        color: 0x156289,
        emissive: 0x072534,
        side: THREE.DoubleSide,
        flatShading: true
    } );
    
    this.cube = new THREE.Mesh( geometry, material );
    this.cube.position.set(-83.29314565880259, 36.427311608619064, 118.50835837163037)
    this.scene.add( this.cube );
  }

  setScale() {
    this.mesh.scale.set(
      this.params.scale,
      this.params.scale,
      this.params.scale
    );
  }

  addGeometry(geometry) {
    // 3D shape

    this.mesh = new THREE.Mesh(geometry, this.material);
    // const wireframe = new THREE.Mesh(geometry, this.wireframeMaterial);
    // this.mesh.add(wireframe);

    this.parent.add(this.mesh);
  }

  animateCamera() {
    this.cameraHelper.visible = this.params.cameraHelper;
    this.cameraEye.visible = this.params.cameraHelper;
  }

  updateCamera = (t) => {
    // const time = Date.now();
    // const looptime = 20 * 1000;
    // const t = (time % looptime) / looptime;

    this.tubeGeometry.parameters.path.getPointAt(t, this.position);
    this.position.multiplyScalar(this.params.scale);

    // interpolation

    const segments = this.tubeGeometry.tangents.length;
    const pickt = t * segments;
    const pick = Math.floor(pickt);
    const pickNext = (pick + 1) % segments;

    this.binormal.subVectors(
      this.tubeGeometry.binormals[pickNext],
      this.tubeGeometry.binormals[pick]
    );
    this.binormal
      .multiplyScalar(pickt - pick)
      .add(this.tubeGeometry.binormals[pick]);

    this.tubeGeometry.parameters.path.getTangentAt(t, this.direction);
    const offset = 2;

    this.normal.copy(this.binormal).cross(this.direction);

    // we move on a offset on its binormal

    this.position.add(this.normal.clone().multiplyScalar(offset));

    this.splineCamera.position.copy(this.position);
    this.cameraEye.position.copy(this.position);

    // using arclength for stablization in look ahead

    this.tubeGeometry.parameters.path.getPointAt(
      (t + 30 / this.tubeGeometry.parameters.path.getLength()) % 1,
      this.lookAt
    );
    this.lookAt.multiplyScalar(this.params.scale);

    // camera orientation 2 - up orientation via normal

    if (!this.params.lookAhead)
      this.lookAt.copy(this.position).add(this.direction);
    this.splineCamera.matrix.lookAt(
      this.splineCamera.position,
      this.lookAt,
      this.normal
    );
    this.splineCamera.quaternion.setFromRotationMatrix(
      this.splineCamera.matrix
    );

    this.cameraHelper.update();
  };

  startAnimationLoop = () => {
    if (this.cube) {
      this.cube.rotation.x += 0.01;
      this.cube.rotation.y += 0.01;
    }

    if(!this.params.animationView) {
      // this.updateCamera();
      this.controls.update()
    }
    // if(this.material && this.material.uniforms) {
    //   this.material.uniforms.uTime.value = this.clock.getElapsedTime();

    // }

    this.renderer.render(
      this.scene,
      this.params.animationView ? this.splineCamera : this.camera
    );

    // The window.requestAnimationFrame() method tells the browser that you wish to perform
    // an animation and requests that the browser call a specified function
    // to update an animation before the next repaint
    this.requestID = window.requestAnimationFrame(this.startAnimationLoop);
  };

  handleWindowResize = () => {
    this.width = this.mount.clientWidth;
    this.height = this.mount.clientHeight;

    this.renderer.setSize(this.width, this.height);
    this.camera.aspect = this.width / this.height;

    // Note that after making changes to most of camera properties you have to call
    // .updateProjectionMatrix for the changes to take effect.
    this.camera.updateProjectionMatrix();
    this.splineCamera.updateProjectionMatrix();
  };

  onDocumentDoubleClick = event => {
    this.params.animationView = !this.params.animationView;

    if (this.params.animationView) {
        // this.wireframeMaterial.transparent = false;
      this.controls.dispose();
    } else {
      // this.wireframeMaterial.transparent = true;
      this.setupControls();

    }
  };

  onMouseWheel = event => {
    let numOfPoints = 350;
    if(event.deltaY > 0) {
      // if(this.camPosIndex < numOfPoints - 1) {
        this.camPosIndex++;
      // }
    } else if(event.deltaY < 0) {
      if(this.camPosIndex > 0) {
        this.camPosIndex--;
      }
    }

    this.updateCamera((this.camPosIndex % numOfPoints)/numOfPoints)

  };

  addEventListeners = () => {
    document.addEventListener("dblclick", this.onDocumentDoubleClick, false);
    window.addEventListener("resize", this.handleWindowResize, false);
    window.addEventListener("wheel", this.onMouseWheel, false);
  };

  removeEventListeners = () => {
    document.removeEventListener("dblclick", this.onDocumentDoubleClick);
    window.removeEventListener("resize", this.handleWindowResize);
    window.addEventListener("wheel", this.onMouseWheel);
  };

  render() {
    return <div style={style} ref={ref => (this.mount = ref)} />;
  }
}

export default Environment;
