import React from 'react'

const blankClass = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  width: '100vw',
  height: '100vh',
  fontSize: 18,
  backgroundColor: '#eee'
}

function Blank() {
  return (
    <div style={blankClass}>您访问的页面被外星人带走啦...</div>
  )
}

export default Blank;