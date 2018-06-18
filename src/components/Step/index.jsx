import React from 'react'
import PropTypes from 'prop-types'
import Transition from 'react-transition-group/Transition'
import merge from 'lodash.merge'

const duration = 200

const transitionContainerStyle = {
  opacity: 1,
  position: 'absolute',
  top: 0,
  transition: `all ${duration}ms ease-in-out`,
}

const transitionsState = {
  entering: { opacity: 1 },
  entered: { opacity: 1 },
  exiting: { opacity: 0 },
  // we reset the transition prop when .exited is applied so the next component
  // render will have a hard edge property and not try to transition to it
  exited: { opacity: 0, transition: 'inherit' },
}

const Step = ({
  children,
  exitDirection,
  parentDimensions,
  show,
  transitionDirection,
  ...props
}) => {
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
    <Transition in={show} timeout={duration}>
      {state => (
        <div
          style={{
            ...transitionContainerStyle,
            ...merge(transitionsState[state], transitionsDirection[state]),
          }}
        >
          {typeof children === 'function'
            ? children(...props)
            : React.cloneElement(children, props)}
        </div>
      )}
    </Transition>
  )
}

Step.propTypes = {
  children: PropTypes.oneOfType([PropTypes.func, PropTypes.node]).isRequired,
  exitDirection: PropTypes.oneOf(['left','right']),
  parentDimensions: PropTypes.shape({ height: PropTypes.number, width: PropTypes.number }),
  show: PropTypes.bool,
  transitionDirection: PropTypes.oneOf(['horizontal', 'vertical'])
}
Step.defaultProps = {
  exitDirection: 'left',
  parentDimensions: { height: 0, width: 0 },
  show: false,
  transitionDirection: 'horizontal'
}

export default Step
