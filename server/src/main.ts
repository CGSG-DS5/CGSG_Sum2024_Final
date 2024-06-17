import * as fs from 'fs';
import { addAbortSignal } from 'stream';

const txt = fs
  .readFileSync('server/bin/readme.txt', 'ascii')
  .toString()
  .split('\n');

interface catalogHeaderLine {
  start: number;
  end: number;
  format: string;
  units: string;
  label: string;
  explanations: string;
}

interface catalogHeader {
  name: string;
  lines: catalogHeaderLine[];
}

interface catalogData {
  [name: string]: string;
}

interface fileCatalog {
  header: catalogHeader;
  data: catalogData[];
}

let files: fileCatalog[] = [];

const READING_FREE = 0;
const READING_START = 1;
const READING_DESC = 2;

let curState = READING_FREE;
let curFile = 0;

function readDescLine(line: string) {
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

    files[files.length - 1].header.lines.push(l);
  } else {
    files[files.length - 1].header.lines[
      files[files.length - 1].header.lines.length - 1
    ].explanations += line.substring(33, line.length - 1);
  }
}

let skip = 0;

txt.forEach((line) => {
  switch (curState) {
    case READING_FREE:
      if (line.startsWith('Byte-by-byte Description of file:')) {
        curState = READING_START;
        skip = 0;

        files.push({
          header: { name: line.split(' ')[4], lines: [] },
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

files.forEach((f) => {
  const fr = fs
    .readFileSync('server/bin/' + f.header.name, 'binary')
    .toString()
    .split('\n');

  let j = 0;
  fr.forEach((line) => {
    if (line == '') return;
    f.data[j] = {};
    f.header.lines.forEach((p) => {
      f.data[j][p.label] = line.substring(p.start, p.end + 1);
    });
    j++;
  });
});

fs.writeFileSync('out.json', JSON.stringify(files));
