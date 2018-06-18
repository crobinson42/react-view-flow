import React from 'react'
import ReactDOM from 'react-dom'

import ViewFlow from './index'

it('components/ViewFlow renders without crashing', () => {
  const div = document.createElement('div')
  ReactDOM.render(<ViewFlow />, div)
  ReactDOM.unmountComponentAtNode(div)
})
