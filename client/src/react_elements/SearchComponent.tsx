import React, { FormEvent, KeyboardEvent } from 'react';
import { anim } from '../anim/anim.js';

export function SearchComponent(props: { ani: anim }) {
  const onSub = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key == 'Enter')
      props.ani.fetchInfo = (e.target as HTMLInputElement).value;
  };

  return (
    <input
      type="search"
      placeholder="Search using json style!"
      style={{
        position: 'absolute',
        top: '10px',
        left: `${(window.innerWidth - 300) / 2}px`,
        alignSelf: 'center',
        borderRadius: '5px',
        width: '300px',
        height: '44px',
        color: 'white',
        font: '25px sans-serif',
        backgroundColor: 'rgb(128, 128, 128, 0.3)'
      }}
      onKeyUp={onSub}
    ></input>
  );
}
