import { camera } from '../mth/mthcamera';

export class timer extends camera {
  isPause: boolean = false;
  globalTime: number = 0;
  globalDeltaTime: number = 0;
  localTime: number = 0;
  localDeltaTime: number = 0;
  localTimeScale: number = 1;
  fps: number = 30.7;
  gmst: number = 0;

  private startTime: number = 0;
  private oldTime: number = 0;
  private oldTimeFPS: number = 0;
  private pauseTime: number = 0;
  private frameCounter: number = 0;

  init() {
    let date: Date = new Date();
    this.startTime =
      this.oldTimeFPS =
      this.oldTime =
      this.globalTime =
      this.localTime =
        Date.now() / 1000;
  }

  response() {
    let t = Date.now() / 1000;
    this.globalTime = t;
    this.globalDeltaTime = t - this.oldTime;

    if (this.isPause) {
      this.localDeltaTime = 0;
      this.pauseTime += this.globalDeltaTime;
    } else {
      this.localDeltaTime = this.globalDeltaTime;
      this.localTime = t - this.pauseTime - this.startTime;
    }

    this.frameCounter++;
    if (t - this.oldTimeFPS > 3) {
      this.fps = this.frameCounter / (t - this.oldTimeFPS);
      this.oldTimeFPS = t;
      this.frameCounter = 0;
    }

    this.oldTime = t;

    const date = new Date();
    let y = date.getUTCFullYear();
    let m = date.getUTCMonth();
    let d = date.getUTCDay();

    if (m == 1 || m == 2) {
      y--;
      m += 12;
    }

    let jd =
      Math.floor(365.25 * (y + 4716)) +
      Math.floor(30.6001 * (m + 1)) +
      d +
      2 -
      (3 * y) / 400 -
      1524.5;

    const t1 = (jd - 2451545.0) / 36525;
    const theta0 =
      280.46061837 +
      360.98564736629 * (jd - 2451545) +
      0.000387933 * t1 * t1 -
      (t1 * t1 * t1) / 38710000;
    this.gmst = theta0 % 360;
    if (this.gmst < 0) this.gmst += 360;
    this.gmst = this.gmst / 15;

    // lmst = gmst + longtitude / 15
  }
}
