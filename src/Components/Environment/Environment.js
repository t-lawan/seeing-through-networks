import React, { Component } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { Colours } from "../Global/global.styles";
import { Curves } from "../../Utility/Curves";
import { AfterimagePass } from "../../Utility/AfterImagePass";
import { EffectComposer } from "../../Utility/EffectComposer";
import { RenderPass } from "../../Utility/RenderPass";
import LAURIE_DRONE from "../../Assets/Audio/LAURIE_DRONE.mp3";
import LAURIE_DRUMS from "../../Assets/Audio/LAURIE_DRUMS.mp3";
import styled from 'styled-components'
import { ModalTypes } from "../../Utility/Helper";
import Modal from "../Modal/Modal";
const style = {
  height: "100vh" // we can control scene size by setting container dimensions
};
const EnvironmentWrapper = styled.div`
  height: 100vh
`
const MenuWrapper = styled.div`
  width: 100vw;
  height: 15vh;
  position: absolute;
  bottom: 0;
  /* background: red; */
  z-index: 1000;
  display: ${props => props.show ? 'block': 'none'};
`

const MenuFlexWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  height: 100%;
`

const MenuText = styled.h1`
  color: ${Colours.green};
`
class Environment extends Component {
  width;
  height;
  parent;
  tubeGeometry;
  mesh;
  cameraHelper;
  composer;
  afterImagePass;
  camPosIndex = 0;
  colour;
  factor = 1;
  hValue = 0;
  sValue = 0.2;
  lValue = 0.4;
  sound;
  audioDetune = 0;
  clickableObjects = [];
  state = {
    animationView: true,
    pause: true,
    showModal: true,
    modalType: ModalTypes.INTRODUCTION
  }

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
    this.colour = new THREE.Color(0x79a6bc);
    this.colour.setHSL(this.hValue, this.sValue, this.lValue);
    this.setupScene();
    this.setupCamera();
    this.setupControls();
    this.setupLights();
    this.setupSpline();
    this.parent = new THREE.Object3D();
    this.scene.add(this.parent);
    this.setupLoadingManager();
    this.setupSplineCamera();
    this.setupCameraHelper();
    this.addTube();
    this.animateCamera();
    this.setupRayCaster();
    this.setupMouse();
    this.setupAudioListener();
    this.setupRenderer();
    this.setupPostProcessing();
    // this.setupAudio();
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
  setupPostProcessing = () => {
    this.composer = new EffectComposer(this.renderer);
    this.composer.addPass(new RenderPass(this.scene, this.splineCamera));
    this.afterImagePass = new AfterimagePass();
    this.composer.addPass(this.afterImagePass);
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

  setupAudioListener = () => {
    this.audioListener = new THREE.AudioListener();
    this.camera.add(this.audioListener);
    this.splineCamera.add(this.audioListener);
  };

  setupAudio = () => {
    this.audioLoader = new THREE.AudioLoader(this.manager);
    this.sound = new THREE.Audio(this.audioListener);
    this.audioLoader.load(LAURIE_DRONE, buffer => {
      this.sound.setBuffer(buffer);
      this.playSound();
    });
  };

  playSound = () => {
    if (this.sound) {
      this.sound.setLoop(true);
      this.sound.setVolume(0.1);
      this.sound.playbackRate = 0.7;
      this.sound.detune = this.audioDetune;
      this.sound.play();
    }
  };

  setupLoadingManager = () => {
    this.manager = new THREE.LoadingManager();
    this.manager.onStart = this.loadStart;
    this.manager.onProgress = this.loadProgressing;
    this.manager.onLoad = this.loadFinished;
  };

  loadStart = (url, itemsLoaded, itemsTotal) => {
    // this.props.isLoading();
    // this.props.loading(itemsLoaded, itemsTotal);
  };

  loadProgressing = (url, itemsLoaded, itemsTotal) => {
    // this.props.loading(itemsLoaded, itemsTotal);
  };

  loadFinished = () => {
    // this.props.hasLoaded();
    // this.onWindowResize();
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
    this.scene.background = new THREE.Color(Colours.blue);
    // this.scene.fog = new THREE.Fog(0xffffff, 1, 12);
  };

  setupLights = () => {
    const lights = [];
    lights[0] = new THREE.PointLight(Colours.green, 1, 0);
    lights[1] = new THREE.PointLight(Colours.green, 1, 0);
    lights[2] = new THREE.PointLight(Colours.yellow, 1, 0);

    lights[0].position.set(0, 200, 0);
    lights[1].position.set(100, 200, 100);
    lights[2].position.set(-100, -200, -100);

    this.scene.add(lights[0]);
    this.scene.add(lights[1]);
    this.scene.add(lights[2]);
  };

  setupRayCaster = () => {
    this.raycaster = new THREE.Raycaster();
  };

  setupMouse = () => {
    this.mouse = new THREE.Vector2();
  };

  setMouse = event => {
    this.mouse.x = (event.clientX / this.mount.clientWidth) * 2 - 1;
    this.mouse.y = -(event.clientY / this.mount.clientHeight) * 2 + 1;
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
      color: new THREE.Color(this.colour),
      transparent: false,
      side: THREE.DoubleSide
      // gradientMap: THREE.NearestFilter
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

      this.addFirstCube()
      this.addSecondCube();
      this.addThirdCube();
  }

  addFirstCube = () => {
    const geometry = new THREE.BoxGeometry(5, 5, 5);
    const material = new THREE.MeshPhongMaterial({
      color: 0x156289,
      emissive: 0x072534,
      side: THREE.DoubleSide,
      flatShading: true
    });

    this.cube = new THREE.Mesh(geometry, material);
    // let point = this.tubeGeometry.parameters.path.getPointAt(0.7);
    // this.cube.position.set(point.x, point.y, point.z)
    this.cube.position.set(
      -80.8578995628169,
      35.27833747091873,
      120.70613396610423
    );
    this.cube.userData.modalType = ModalTypes.INTRODUCTION;
    this.clickableObjects.push(this.cube);
    this.scene.add(this.cube);
  }

  addSecondCube = () => {
    const geometry = new THREE.BoxGeometry(5, 5, 5);
    const material = new THREE.MeshPhongMaterial({
      color: "red",
      emissive: 0x072534,
      side: THREE.DoubleSide,
      flatShading: true
    });

    let cube = new THREE.Mesh(geometry, material);
    // let point = this.tubeGeometry.parameters.path.getPointAt(0.7);
    // this.cube.position.set(point.x, point.y, point.z)
    cube.position.set(
      -9.969726519441327,
      -4.203168989231084,
      -126.90679745325926
    );
    cube.userData.modalType = ModalTypes.NEOLIBERAL_FILM;
    this.clickableObjects.push(cube);
    this.scene.add(cube);
  }

  addThirdCube = () => {
    const geometry = new THREE.BoxGeometry(5, 5, 5);
    const material = new THREE.MeshPhongMaterial({
      color: "green",
      emissive: 0x072534,
      side: THREE.DoubleSide,
      flatShading: true
    });

    let cube = new THREE.Mesh(geometry, material);
    cube.position.set(
      -256.80947141936144,
      4.063884826255481,
      55.82735307181664
    );
    cube.userData.modalType = ModalTypes.BURNING_MAN;

    this.clickableObjects.push(cube);
    this.scene.add(cube);
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

  updateCamera = t => {
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

  enterWorld = () => {
    this.setState({
      animationView: !this.state.animationView
    })
    this.params.animationView = !this.params.animationView;
    // console.log(this.hValue + ", ");
    // if (this.state.animationView) {
      // this.wireframeMaterial.transparent = false;
      this.updateCamera(1/500);
      this.controls.dispose();
    // } else {
      // this.wireframeMaterial.transparent = true;
      // this.setupControls();
    // }
  }

  openModal = (modalType) => {
    console.log('OPEN MODAL')
    this.setState({
      showModal: true,
      modalType: modalType,
      pause: true
    })
  }

  closeModal = () => {
    // this.controls.enabled = true;
    this.setState({
      pause: false,
      showModal: false,
    })

  }

  renderEnvironment = () => {
    if(!this.state.pause) {
      if (!this.state.animationView) {
        // this.updateCamera();
        this.controls.update();
        this.renderer.render(
          this.scene,
          this.state.animationView ? this.splineCamera : this.camera
        );
      } else {
        this.composer.render();
      }
      if (this.sound) {
        this.sound.detune = this.audioDetune;
      }

      // The window.requestAnimationFrame() method tells the browser that you wish to perform
      // an animation and requests that the browser call a specified function
      // to update an animation before the next repaint
    }
  }

  updateColours = () => {
    let speed = 0.001;
    if (this.hValue <= 0) {
      this.factor = 1;
    } else if (this.hValue >= 1) {
      this.factor = -1;
    }

    this.hValue += speed * this.factor;

    this.colour.lerpColors(
      new THREE.Color(Colours.green).setHSL(0.4, this.sValue, this.lValue),
      new THREE.Color(Colours.green).setHSL(0.5, this.sValue, this.lValue),
      this.hValue
    );
    // this.colour.setHSL(this.hValue,this.sValue, this.lValue);
    this.material.color.set(this.colour);
  }
  startAnimationLoop = () => {
    this.requestID = requestAnimationFrame(this.startAnimationLoop);
    this.renderEnvironment()
    this.updateColours()

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
    // this.enterWorld();
    if(!this.state.pause) {
      console.log('onMouseClick', this.splineCamera.position)

      event.preventDefault();
      this.setMouse(event);
  
      this.raycaster.setFromCamera(this.mouse, this.splineCamera);
      this.intersects = this.raycaster.intersectObjects(
        this.clickableObjects,
        true
      );
  
      if (this.intersects.length > 0) {
        console.log(this.intersects[0])
        let obj = this.intersects[0].object;
        this.openModal(obj.userData.modalType)
        obj.material.color.r = 0;
        obj.material.color.g = 255;
        obj.material.color.b = 0;
      }
    }

  };
  

  onMouseClick = event => {
    console.log('onMouseClick', this.splineCamera.position)
  };

  onDocumentMouseMove = event => {
    event.preventDefault();
    this.setMouse(event);
    this.raycaster.setFromCamera(this.mouse, this.camera);
    this.intersects = this.raycaster.intersectObjects(
      this.clickableObjects,
      true
    );
    if (this.intersects.length > 0) {
      console.log('', this.mouse)
      console.log(this.intersects[0])
      let obj = this.intersects[0].object;
      obj.material.color.r = 0;
      obj.material.color.g = 255;
      obj.material.color.b = 0;
    }
    let boundingBoxes = this.clickableObjects.map(object => {
        return object.objectBoundary;
    })
  };

  onMouseWheel = event => {
    if(!this.state.pause){
      let numOfPoints = 500;
      this.move(event);

      let i = (this.camPosIndex % numOfPoints) / numOfPoints;
      this.audioDetune = i * 12000;
      this.hValue = i;
      this.colour.lerpColors(
        new THREE.Color("white").setHSL(0.1, this.sValue, this.lValue),
        new THREE.Color("white").setHSL(0.15, this.sValue, this.lValue),
        this.hValue
      );
  
      // this.colour.setHSL(this.hValue,this.sValue, this.lValue);
      this.material.color.set(this.colour);
  
      this.updateCamera(i);
    }

  };

  move = (event) => {
    if (event.deltaY > 0) {
      this.moveUp()
      // if(this.camPosIndex < numOfPoints - 1) {
      // }
    } else if (event.deltaY < 0) {
      if (this.camPosIndex > 0) {
        this.moveDown()
      }
    }
  }

  moveUp = () => {
    this.camPosIndex++;
  }

  moveDown = () => {
    this.camPosIndex--;
  }

  addEventListeners = () => {
    // document.addEventListener("mousemove", this.onDocumentMouseMove, false);
    document.addEventListener("dblclick", this.onDocumentDoubleClick, false);
    window.addEventListener("resize", this.handleWindowResize, false);
    window.addEventListener("wheel", this.onMouseWheel, false);
  };

  removeEventListeners = () => {
    // document.removeEventListener("mousemove", this.onDocumentMouseMove);
    document.removeEventListener("dblclick", this.onDocumentDoubleClick);
    window.removeEventListener("resize", this.handleWindowResize);
    window.addEventListener("wheel", this.onMouseWheel);
  };

  render() {
    return (
    <EnvironmentWrapper ref={ref => (this.mount = ref)}> 
      <MenuWrapper show={!this.state.animationView}>
        <MenuFlexWrapper>
          <MenuText onClick={() => this.enterWorld()}> Enter</MenuText>
        </MenuFlexWrapper>
      </MenuWrapper>
      <Modal show={this.state.showModal} type={this.state.modalType} closeModal={this.closeModal.bind(this)}/>
    </EnvironmentWrapper>);
  }
}

export default Environment;
