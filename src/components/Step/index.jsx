// @flow
import * as React from 'react'
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

type StepProps = {
  children: Function | React.Node,
  exitDirection?: 'string',
  id?: string,
  onMount?: Function,
  onUnmount?: Function,
  parentDimensions?: { height: number, width: number },
  setContainerDimensions?: Function,
  show?: boolean,
  transitionDirection?: string,
}

type StepState = {}

class Step extends React.Component<StepProps, StepState> {
  static propTypes = {
    children: PropTypes.oneOfType([PropTypes.func, PropTypes.node]).isRequired,
    exitDirection: PropTypes.oneOf(['left', 'right']),
    id: PropTypes.string,
    onMount: PropTypes.func,
    onUnmount: PropTypes.func,
    parentDimensions: PropTypes.shape({
      height: PropTypes.number,
      width: PropTypes.number,
    }),
    setContainerDimensions: PropTypes.func,
    show: PropTypes.bool,
    transitionDirection: PropTypes.oneOf(['horizontal', 'vertical']),
  }

  static defaultProps = {
    exitDirection: 'left',
    id: undefined,
    onMount: undefined,
    onUnmount: undefined,
    parentDimensions: { height: 0, width: 0 },
    setContainerDimensions: () => null,
    show: false,
    transitionDirection: 'horizontal',
  }

  componentDidMount() {
    if (this.props.onMount) this.props.onMount()
  }

  componentWillUnmount() {
    console.log('step unmounting...', this.props.onUnmount)
    if (this.props.onUnmount) this.props.onUnmount()
  }

  setRef = (el: HTMLDivElement) => {
    if (el && this.props.setContainerDimensions) {
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

    const parentWidth = parentDimensions && parentDimensions.width || 0

    const transitionsDirection = {
      entering: { [axisEdge]: 0 },
      entered: { [axisEdge]: 0 },
      exiting: {
        [axisEdge]:
          exitDirection === 'left'
            ? -parentWidth
            : parentWidth,
      },
      exited: {
        [axisEdge]:
          exitDirection === 'left'
            ? parentWidth
            : -parentWidth,
      },
    }

    if (!children) return null

    return (
      <Transition in={show} timeout={CSS_TRANSITION_DURATION}>
        {state => (
          <div
            // $FlowFixMe
            ref={this.setRef}
            style={{
              ...transitionContainerStyle,
              ...merge(transitionsState[state], transitionsDirection[state]),
            }}
          >
            {typeof children === 'function'
              ? children(props)
              : React.cloneElement(React.Children.only(children), props)}
          </div>
        )}
      </Transition>
    )
  }
}


export default Step
