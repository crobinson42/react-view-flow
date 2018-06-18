import React, { Component } from 'react'
import Transition from 'react-transition-group/Transition'
// import PropTypes from 'prop-types'

class Trans extends Component {
  static propTypes = {}

  static defaultProps = {}

  state = {}

  render() {
    return (
      <Transition in={inProp} timeout={duration}>
        {(state) => (
          <div style={{
            ...defaultStyle,
            ...transitionStyles[state]
          }}>
            I'm a fade Transition!
          </div>
        )}
      </Transition>
    )
  }
}

export default Trans
