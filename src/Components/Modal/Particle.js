export default class Particle{
    constructor(x,y, p5, video){
        this.x = x;
        this.p5 = p5;
        this.y = y;
        this.video = video
        this.r = this.p5.random(4, 32);
    }

  
    update = () => {
      this.x += this.p5.random(-10, 10);
      this.y += this.p5.random(-10, 10);
  
      this.x = this.p5.constrain(this.x, 0, this.p5.width);
      this.y = this.p5.constrain(this.y, 0, this.p5.height);
    };
  
    show = () => {
    this.p5.noStroke();
      var px = this.p5.floor(this.x / 16);
      var py = this.p5.floor(this.y / 16);
    //   let px = this.x;
    //   let py = this.y;
      var col = this.video.get(px, py);
      //console.log(col);
      this.p5.fill(col[0], col[1], col[2], 255);
      this.p5.ellipse(this.x, this.y, this.r, this.r);
    };
  }