import React from 'react'
import './index.css'
import DataViewer from '../DataViewer'
import data from './data-1.json'

const Demo = () => (
  <div className="Demo">
    <header className="Demo-header">DataViewer demo</header>
    <DataViewer {...{data}} />
  </div>
)

export default Demo
