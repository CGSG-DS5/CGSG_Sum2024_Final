import React from 'react';
import { anim } from '../anim/anim.js';

export function StarComponent(props: { ani: anim }) {
  return props.ani.curStar ? (
    <div
      style={{
        background: 'rgba(66, 66, 66, 0.3)',
        position: 'absolute',
        top: '50px',
        right: '50px',
        width: '400px'
      }}
    >
      <p style={{ margin: '10px', color: 'white', font: '15px sans-serif' }}>
        Name: {props.ani.curStar.name}
      </p>
      <p style={{ margin: '10px', color: 'white', font: '15px sans-serif' }}>
        Ra: {props.ani.curStar.rasc.toFixed(5)}; De:{' '}
        {props.ani.curStar.decl.toFixed(5)}
      </p>
      <p style={{ margin: '10px', color: 'white', font: '15px sans-serif' }}>
        Magnitude: {props.ani.curStar.magn}
      </p>
    </div>
  ) : (
    <></>
  );
}
