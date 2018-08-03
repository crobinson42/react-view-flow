import React from 'react'
import PropTypes from 'prop-types'
import Transition from 'react-transition-group/Transition'
import merge from 'lodash.merge'

import { CSS_TRANSITION_DURATION } from '../../contants'

const transitionContainerStyle = {
  opacity: 1,
  position: 'relative',
  top: 0,
  transition: `all ${CSS_TRANSITION_DURATION}ms ease-in-out`,
}

const transitionsState = {
  entering: { opacity: 1 },
  entered: { opacity: 1 },
  exiting: { opacity: 0 },
  // we reset the transition prop when .exited is applied so the next component
  // render will have a hard edge property and not try to transition to it
  exited: { opacity: 0, transition: 'inherit' },
}

class Step extends React.Component {

  componentDidMount() {
    if (this.props.onMount) this.props.onMount()
  }

  componentWillUnmount() {
    if (this.props.onUnmount) this.props.onUnmount()
  }

  setRef = el => {
    if (el) {
      this.props.setContainerDimensions(el.offsetHeight, el.offsetWidth)
    }
  }

  render() {
    const {
      children,
      exitDirection,
      parentDimensions,
      setContainerDimensions,
      show,
      transitionDirection,
      ...props
    } = this.props

    const axisEdge = transitionDirection === 'horizontal' ? 'left' : 'top'

    const transitionsDirection = {
      entering: { [axisEdge]: 0 },
      entered: { [axisEdge]: 0 },
      exiting: {
        [axisEdge]:
          exitDirection === 'left'
            ? -parentDimensions.width
            : parentDimensions.width,
      },
      exited: {
        [axisEdge]:
          exitDirection === 'left'
            ? parentDimensions.width
            : -parentDimensions.width,
      },
    }

    if (!children) return null

    return (
      <Transition in={show} timeout={CSS_TRANSITION_DURATION}>
        {state => (
          <div
            ref={this.setRef}
            style={{
              ...transitionContainerStyle,
              ...merge(transitionsState[state], transitionsDirection[state]),
            }}
          >
            {typeof children === 'function'
              ? children(props)
              : React.cloneElement(children, props)}
          </div>
        )}
      </Transition>
    )
  }
}

Step.propTypes = {
  children: PropTypes.oneOfType([PropTypes.func, PropTypes.node]).isRequired,
  exitDirection: PropTypes.oneOf(['left', 'right']),
  id: PropTypes.string,
  onMount: PropTypes.func,
  onUnmount: PropTypes.func,
  parentDimensions: PropTypes.shape({
    height: PropTypes.number,
    width: PropTypes.number,
  }),
  setContainerDimensions: PropTypes.func.isRequired,
  show: PropTypes.bool,
  transitionDirection: PropTypes.oneOf(['horizontal', 'vertical']),
}
Step.defaultProps = {
  exitDirection: 'left',
  id: undefined,
  onMount: undefined,
  onUnmount: undefined,
  parentDimensions: { height: 0, width: 0 },
  show: false,
  transitionDirection: 'horizontal',
}

export default Step
