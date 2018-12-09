import React from 'react'
import './index.css'
import DataViewer from '../DataViewer'
import data from './data-1.json'
import {standardize} from './data-1.config'

const Demo = () => (
  <div className="Demo">
    <header className="Demo-header">DataViewer demo</header>
    <DataViewer {...{data, standardize}} />
  </div>
)

export default Demo
