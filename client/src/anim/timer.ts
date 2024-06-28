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

  strDate: string = '2024-06-08 03:50';

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

    const date = new Date(this.strDate.replace('T', ' '));
    let y = date.getUTCFullYear();
    let m = date.getUTCMonth() + 1;
    const d = date.getUTCDate();
    const h =
      date.getUTCHours() +
      (date.getUTCMinutes() + date.getUTCSeconds() / 60) / 60;

    if (m <= 2) {
      y = y - 1;
      m = m + 12;
    }
    const A = Math.floor(y / 100);
    const B = 2 - A + Math.floor(A / 4);
    const C = Math.floor(365.25 * y);
    const D = Math.floor(30.6001 * (m + 1));

    const jd = B + C + D + d + 1720994.5;

    const S = jd - 2451545;
    const T = S / 36525;

    let T0 = 6.697374558 + 2400.051336 * T + 0.000025862 * Math.pow(T, 2);
    if (T0 < 0) T0 += 24 * Math.abs(Math.floor(T0 / 24));
    else T0 -= 24 * Math.abs(Math.floor(T0 / 24));

    T0 += h * 1.002737909;
    if (T0 < 0) T0 += 24;
    if (T0 > 24) T0 -= 24;

    this.gmst = T0;

    // lmst = gmst + longtitude / 15
  }
}
