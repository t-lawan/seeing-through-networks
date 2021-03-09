export class Shader {
  static vertex = () => {
    return `
    precision mediump float;
    varying vec2 vUv;
                         
    void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix *    vec4(position, 1.0);
    }`;
  };


  static fragment = () => {
      return `
      #ifdef GL_ES
      precision highp float;
      #endif
      
      #define PI2 6.28318530718
      #define MAX_ITER 5
      
      uniform float uTime;
      uniform vec2 uResolution;
      uniform float spectrum;
      
      
      void mainImage( out vec4 fragColor, in vec2 fragCoord )
      {
          float uTime = uTime * .12;
          vec2 uv = fragCoord.xy / uResolution.xy;
      
          vec2 p = mod(uv * PI2, PI2) - 100.0  ;
          vec2 i = vec2(p);
          float c = 0.5;
          float inten =  .0094;
      
          for (int n = 0; n < MAX_ITER; n++) {
              float t = uTime * (4.5 - (2.2 / float(n + 122)));
              i = p + vec2(cos(t - i.x) + sin(t + i.y), sin(t - i.y) + cos(t + i.x));
              c += 1.0 / length(vec2(p.x / (sin(i.x + t) / inten + spectrum), p.y / (cos(i.y + t) / inten)));
          }
      
          c /= float(MAX_ITER);
          c = 1.10-pow(c, 1.26);
          vec3 colour = vec3(0.098, 0.098, .098+pow(abs(c), 4.1));
      
          fragColor = vec4(colour, 1.3);
      }
      
      
      void main( void ) {
          mainImage(gl_FragColor, gl_FragCoord.xy);}
      `
  }

  static uniforms = () => {
    //   return {
    //     uTime: { value: 0.0 },
    //     uResolution: { value: { x: window.innerWidth, y: window.innerHeight } },
    //     uColor: { value: new THREE.Color(0xffffff) }
    //   }
  }
}
