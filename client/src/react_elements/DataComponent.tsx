import React, { ChangeEvent } from 'react';
import { anim } from '../anim/anim.js';

export function DataComponent(props: { ani: anim }) {
  const dataPick = (e: ChangeEvent<HTMLInputElement>) => {
    console.log(e.target.value);
    props.ani.strDate = e.target.value.replace('T', ' ');
  };

  return (
    <div>
      <input
        style={{
          position: 'absolute',
          bottom: '20px',
          left: '10px',
          fontSize: '30px'
        }}
        type="datetime-local"
        id="start"
        name="trip-start"
        // value={initTime()}
        onChange={dataPick}
      />
    </div>
  );
}
