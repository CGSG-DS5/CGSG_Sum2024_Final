import morgan from 'morgan';
import { star, starManager, star_fetched } from './stars';
import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import { _matr, matr } from '../../client/src/mth/mthmatr';
import { vec3 } from '../../client/src/mth/mthvec3';
import { _vec3 } from '../../client/src/mth/mthvec3';

const app = express();
app.use(morgan('combined'));
app.use(express.static('.'));

const server = http.createServer(app);
const io = new Server(server);

let SM = new starManager();

SM.init('bright_star');

const clients = [];

io.on('connection', (socket) => {
  console.log(`Client connected with id: ${socket.id}`);

  socket.on('fetch_stars', (matrVP: matr, lmst: number, lat: number) => {
    interface star_both {
      s1: star;
      s2: star_fetched;
    }

    const arr: star_both[] = [];
    const response: star_fetched[] = [];

    const vp = _matr(matrVP.a);
    let sinD, cosD, sinH, cosH, sinE, cosE, sinA, cosA;
    const sinL = Math.sin((lat * Math.PI) / 180),
      cosL = Math.cos((lat * Math.PI) / 180);
    let r: vec3, p: vec3;

    SM.stars.forEach((s) => {
      sinD = Math.sin((s.decl * Math.PI) / 180);
      cosD = Math.cos((s.decl * Math.PI) / 180);
      sinH = Math.sin(((lmst - s.rasc) * Math.PI) / 12);
      cosH = Math.cos(((lmst - s.rasc) * Math.PI) / 12);

      sinE = sinL * sinD + cosL * cosD * cosH;
      cosE = Math.sqrt(1 - sinE * sinE);

      sinA = (-cosD * sinH) / cosE;
      cosA = (cosL * sinD - sinL * cosD * cosH) / cosE;

      r = _vec3(cosE * cosA, sinE, cosE * sinA);
      p = vp.pointTransform(r);

      if (Math.abs(p.x) <= 1 && Math.abs(p.y) <= 1)
        arr.push({
          s1: s,
          s2: { sinA: sinA, cosA: cosA, sinE: sinE, cosE: cosE }
        });
    });

    arr.sort((a: star_both, b: star_both) => {
      return b.s1.magn - a.s1.magn;
    });

    const n = Math.min(150, arr.length);
    for (let i = 0; i < n; i++) response.push(arr[i].s2);

    socket.emit('get_stars', response);
  });
});

server.listen(process.env.PORT || 5000, () => {
  const t = server.address();
  if (!t || typeof t == 'string') return;
  console.log('Server started on port' + t.port + ':)');
});
