import React, { Component } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { Colours } from "../Global/global.styles";
import { Curves } from "../../Utility/Curves";
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
      84,
      this.width / this.height,
      0.01,
      1000
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
        color: 0x79a6bc,
    });

    this.wireframeMaterial = new THREE.MeshBasicMaterial({
      color: 0x79a6bc,
      opacity: 0.0,
      wireframe: true,
      transparent: true,
      vertexColors: true
    });
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
    const wireframe = new THREE.Mesh(geometry, this.wireframeMaterial);
    this.mesh.add(wireframe);

    this.parent.add(this.mesh);
  }

  animateCamera() {
    this.cameraHelper.visible = this.params.cameraHelper;
    this.cameraEye.visible = this.params.cameraHelper;
  }

  updateCamera = () => {
    const time = Date.now();
    const looptime = 20 * 1000;
    const t = (time % looptime) / looptime;

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
    const offset = 15;

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

    // this.updateCamera();

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
        this.wireframeMaterial.transparent = false;
      this.controls.dispose();
    } else {
      this.wireframeMaterial.transparent = true;
      this.setupControls();

    }
  };

  onMouseWheel = event => {
    //   console.log('DELTA Y', event.deltaY)
    let numOfPoints = 500;
    if (event.deltaY < 0 && this.camPosIndex < numOfPoints - 1) {
      this.camPosIndex++;
    } else if (event.deltaY > 0 && this.camPosIndex > 0) {
      this.camPosIndex--;
    }

    if(this.camPosIndex > numOfPoints - 2) {
        this.camPosIndex = 0;
    }

    // console.log('CAM: ' + this.camPosIndex, 'POINTS: ', numOfPoints ) 

    if(event.deltaY !== 0 && (this.camPosIndex > 0 && this.camPosIndex < numOfPoints - 2)) {
        this.tubeGeometry.parameters.path.getPoint(
          this.camPosIndex / numOfPoints,
          this.position
        );
        this.position.multiplyScalar(this.params.scale);

        this.binormal.subVectors(
            this.tubeGeometry.binormals[this.camPosIndex],
            this.tubeGeometry.binormals[this.camPosIndex + 1]
          );

        this.tubeGeometry.parameters.path.getTangentAt(this.camPosIndex / numOfPoints, this.direction);
        const offset = 15;

        this.normal.copy(this.binormal).cross(this.direction);
        
        this.position.add(this.normal.clone().multiplyScalar(offset));

        this.splineCamera.position.copy(this.position);
        this.cameraEye.position.copy(this.position);

        this.tubeGeometry.parameters.path.getPointAt(
          (this.camPosIndex + 1) / numOfPoints,
          this.lookAt
        );
        this.lookAt.multiplyScalar(this.params.scale);
    
        this.splineCamera.matrix.lookAt(
          this.splineCamera.position,
          this.lookAt,
          this.normal
        );
    
        this.splineCamera.quaternion.setFromRotationMatrix(
          this.splineCamera.matrix
        );
    
        this.cameraHelper.update();
    }



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
