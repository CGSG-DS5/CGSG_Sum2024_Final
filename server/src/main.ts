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

  socket.on(
    'fetch_stars',
    (matrVP: matr, lmst: number, lat: number, fetchInfo: string) => {
      interface star_both {
        s1: star;
        s2: star_fetched;
      }
      let isOk: (s: star) => boolean;

      try {
        const fi = JSON.parse(fetchInfo);

        isOk = (s: star): boolean => {
          let t = true;
          if ('name' in fi) return (t &&= fi.name == s.name);
          if ('contains' in fi) return (t &&= s.name.includes(fi.contains));
          if ('magn>' in fi) return (t &&= s.magn > Number(fi['magn>']));
          if ('magn<' in fi) return (t &&= s.magn < Number(fi['magn<']));
          if ('magn=' in fi) return (t &&= s.magn == Number(fi['magn=']));

          return t;
        };
      } catch (e) {
        isOk = (s: star): boolean => {
          return true;
        };
      }

      const arr: star_both[] = [];
      const response: star_fetched[] = [];
      const responsed: star[] = [];

      const vp = _matr(matrVP.a);
      let ra, de, sinD, cosD, sinH, cosH, sinE, cosE, sinA, cosA;
      const lat1 = (lat * Math.PI) / 180;
      const sinL = Math.sin(lat1),
        cosL = Math.cos(lat1);
      let r: vec3, p: vec3;

      SM.stars.forEach((s) => {
        ra = lmst - s.rasc;
        if (ra < 0) ra += 24;
        else if (ra >= 24) ra -= 24;
        ra *= Math.PI / 12;

        de = (s.decl * Math.PI) / 180;

        sinD = Math.sin(de);
        cosD = Math.cos(de);
        sinH = Math.sin(ra);
        cosH = Math.cos(ra);

        sinE = sinL * sinD + cosL * cosD * cosH;
        cosE = Math.sqrt(1 - sinE * sinE);

        sinA = (-cosD * sinH) / cosE;
        cosA = (cosL * sinD - sinL * cosD * cosH) / cosE;

        r = _vec3(cosE * cosA, sinE, cosE * sinA);
        p = vp.pointTransform(r);

        if (isOk(s) && Math.abs(p.x) <= 1 && Math.abs(p.y) <= 1 && p.z >= 0)
          arr.push({
            s1: s,
            s2: { sinA: sinA, cosA: cosA, sinE: sinE, cosE: cosE }
          });
      });

      arr.sort((a: star_both, b: star_both) => {
        return a.s1.magn - b.s1.magn;
      });

      const n = Math.min(150, arr.length);
      for (let i = 0; i < n; i++) {
        response.push(arr[i].s2);
        responsed.push(arr[i].s1);
      }

      socket.emit('get_stars', response, responsed);
    }
  );
});

server.listen(process.env.PORT || 5000, () => {
  const t = server.address();
  if (!t || typeof t == 'string') return;
  console.log('Server started on port' + t.port + ':)');
});
