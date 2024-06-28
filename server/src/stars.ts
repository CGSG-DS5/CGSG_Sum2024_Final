import { existsSync, readFileSync, writeFileSync } from 'fs';
import { catalog } from './catalog';

export interface star {
  name: string;
  rasc: number;
  decl: number;
  gLon: number;
  gLat: number;
  paral: number;
  magn: number;
}

export interface star_fetched {
  sinA: number;
  cosA: number;
  sinE: number;
  cosE: number;
}

export class starManager {
  stars: star[] = [];

  init(filePath: string) {
    if (existsSync(__dirname + '/bin/' + filePath + '/' + 'stars.json')) {
      this.stars = JSON.parse(
        readFileSync(
          __dirname + '/bin/' + filePath + '/' + 'stars.json',
          'utf-8'
        ).toString()
      );
    } else {
      let ctl = new catalog();

      ctl.load(filePath);

      let name, rasc, decl, gLon, gLat, paral, magn;
      ctl.files[0].data.forEach((s) => {
        name = s['Name'].trim().replace(/\s+/g, ' ');
        if (name == '') name = s['DM'].trim().replace(/\s+/g, ' ');
        rasc =
          (Number(s['RAs']) / 60 + Number(s['RAm'])) / 60 + Number(s['RAh']);
        decl =
          (s['DE-'] == '-' ? -1 : 1) *
          (Number(s['DEd']) + (Number(s['DEm']) + Number(s['DEs']) / 60) / 60);
        gLon = Number(s['GLON']);
        gLat = Number(s['GLAT']);
        paral = Number(s['Parallax']);
        magn = Number(s['Vmag']);
        this.stars.push({
          name: name,
          rasc: rasc,
          decl: decl,
          gLon: gLon,
          gLat: gLat,
          paral: paral,
          magn: magn
        });
      });

      writeFileSync(
        __dirname + '/bin/' + filePath + '/' + 'stars.json',
        JSON.stringify(this.stars),
        'utf-8'
      );
    }
  }
}
