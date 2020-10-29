import React from 'react';

const Style = {
  width: '100%',
  height: 500,
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center'
};

function Loading() {
  return (
    <div style={Style}>
      <div className="loading-style">
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
      </div>
    </div>
  );
}

export default Loading;
