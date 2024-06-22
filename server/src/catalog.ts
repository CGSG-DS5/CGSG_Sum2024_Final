import { readFileSync } from 'fs';

export interface catalogHeaderLine {
  start: number;
  end: number;
  format: string;
  units: string;
  label: string;
  explanations: string;
}

export interface catalogHeader {
  name: string;
  lines: catalogHeaderLine[];
}

export interface catalogData {
  [name: string]: string;
}

export interface fileCatalog {
  header: catalogHeader;
  data: catalogData[];
}

export class catalog {
  files: fileCatalog[] = [];
  load(dirPath: string) {
    const txt = readFileSync(
      __dirname + '/bin/' + dirPath + '/readme.txt',
      'ascii'
    )
      .toString()
      .split('\n');

    const READING_FREE = 0;
    const READING_START = 1;
    const READING_DESC = 2;

    let curState = READING_FREE;
    let curFile = 0;

    const readDescLine = (line: string) => {
      if (line[7] != ' ') {
        let start: number;
        let end: number;
        let units: string;
        let label: string;

        if (line.charAt(4) == '-') {
          start = Number(line.substring(1, 4)) - 1;
          end = Number(line.substring(5, 8)) - 1;
        } else start = end = Number(line.substring(5, 8)) - 1;

        if (line.substring(17, 20) == '---') {
          units = '---';
          label = line.substring(23, 33).replace(/\s+/g, '');
        } else {
          units = line.substring(15, 24).replace(/\s+/g, '');
          label = line.substring(24, 33).replace(/\s+/g, '');
        }

        let l: catalogHeaderLine = {
          start: start,
          end: end,
          format: line.substring(8, 15).replace(/\s+/g, ''),
          units: units,
          label: label,
          explanations: line.substring(33, line.length - 1)
        };

        this.files[this.files.length - 1].header.lines.push(l);
      } else {
        this.files[this.files.length - 1].header.lines[
          this.files[this.files.length - 1].header.lines.length - 1
        ].explanations += line.substring(33, line.length - 1);
      }
    };

    let skip = 0;

    txt.forEach((line: string) => {
      switch (curState) {
        case READING_FREE:
          if (line.startsWith('Byte-by-byte Description of file:')) {
            curState = READING_START;
            skip = 0;

            const l = line.split(' ')[4];

            this.files.push({
              header: { name: l.substring(0, l.length - 1), lines: [] },
              data: []
            });
          }
          break;

        case READING_START:
          skip++;
          if (skip == 3) curState = READING_DESC;
          break;

        case READING_DESC:
          if (line.startsWith('----------')) {
            curFile++;
            curState = READING_FREE;
          } else readDescLine(line);
          break;
      }
    });

    this.files.forEach((f) => {
      const fr = readFileSync(
        __dirname + '/bin/' + dirPath + '/' + f.header.name,
        'binary'
      )
        .toString()
        .split('\n');

      let j = 0;
      fr.forEach((line: string) => {
        if (line == '') return;
        f.data[j] = {};
        f.header.lines.forEach((p) => {
          f.data[j][p.label] = line.substring(p.start, p.end + 1);
        });
        j++;
      });
    });
  }
}
