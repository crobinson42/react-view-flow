import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { CSS_TRANSITION_DURATION } from '../../contants'
import Url from '../../util/url'

import Styles from '../../styles/index.css'

class ViewFlow extends Component {
  constructor(props) {
    super(props)

    this.url = new Url({ hashKey: props.hashKey })

    const step =
      (props.withHashState && this.url.getStep() - 1) || props.initialStep - 1 || 0

    this.state = {
      containerHeight: 0,
      containerWidth: 0,
      step,
      transitioning: false,
      exitDirection: 'left',
    }
  }

  componentDidMount() {
    this.updateContainerDimensions()

    if (this.props.instance) {
      this.props.instance(this.getRefObject())
    }

    if (this.props.withHashState) {
      if (this.props.hashKey) {
        this.url.setHashKey(this.props.hashKey)
      }

      this.updateHash()

      window.addEventListener('hashchange', this.hashChangeHandler)
    }
  }

  componentDidUpdate(prevProps, prevState) {
    this.updateContainerDimensions()

    if (prevState.step !== this.state.step) {
      if (this.props.onStep) {
        this.props.onStep(this.state.step + 1)
      }

      if (this.props.withHashState) {
        this.updateHash()
      }
    }
  }

  componentWillUnmount() {
    if (this.props.withHashState) {
      window.removeEventListener('hashchange', this.hashChangeHandler)
    }
  }

  getRefObject = () => ({
    __ViewFlow: this,
    complete: this.complete,
    currentStep: this.state.step + 1,
    firstStep: this.firstStep,
    goToStep: stepNumber => { console.log('stepNumber', stepNumber); this.goToStep(stepNumber - 1)},
    lastStep: this.lastStep,
    nextStep: this.nextStep,
    previousStep: this.previousStep,
    totalSteps: this.props.children.length,
  })

  getStepComponentWithProps = (stepIndex, addProps) => {
    // eslint-disable-next-line no-restricted-globals
    if (isNaN(+stepIndex)) {
      // eslint-disable-next-line no-console
      console.warn(
        `<ViewFlow /> step ${stepIndex} is not valid, must be a Number`,
      )

      return null
    }

    const { children } = this.props
    const { containerHeight, containerWidth, step } = this.state

    if (!children.length || !children[stepIndex]) {
      return null
    }

    const props = {
      currentStep: step + 1,
      firstStep: this.firstStep,
      goToStep: stepNumber => this.goToStep(stepNumber - 1),
      lastStep: this.lastStep,
      nextStep: this.nextStep,
      parentDimensions: {
        height: containerHeight,
        width: containerWidth,
      },
      previousStep: this.previousStep,
      totalSteps: children.length,
      ...addProps,
    }

    return React.cloneElement(children[stepIndex], {
      ...props,
    })
  }

  setContainerDimensions = (heightInt, widthInt) => {
    if (!this.containerRef) {
      setTimeout(() => this.setContainerDimensions(heightInt, widthInt), 1)
      return null
    } else if (!heightInt || !widthInt) {
      return null
    } else if (
      heightInt === this.containerRef.offsetHeight &&
      widthInt === this.containerRef.offsetWidth
    ) {
      return null
    }

    this.setState(
      {
        containerHeight: `${heightInt}`,
        containerWidth: `${widthInt}`,
      },
      () => {
        // this.containerRef.style.height = `${this.state.containerHeight}px`
        // this.containerRef.style.width = `${this.state.containerWidth}px`
      },
    )

    return null
  }

  complete = () => {
    if (this.props.onComplete) {
      this.props.onComplete()
    }

    if (this.props.withHashState) {
      this.url.clearHash()
    }
  }

  firstStep = () => {
    this.goToStep(0)
  }

  goToStep = stepIndex => {
    if (this.props.noAnimation) {
      return this.setState({
        step: stepIndex,
      })
    }

    let exitDirection = 'left'

    if (this.state.step < stepIndex) {
      exitDirection = 'left'
    } else if (this.state.step > stepIndex) {
      exitDirection = 'right'
    } else {
      return null
    }

    this.setState(
      {
        transitioning: true,
        exitDirection,
      },
      () => {
        setTimeout(
          () => {
            this.setState({
              step: stepIndex,
              transitioning: false,
            })
          },
          // we add time so that the final state .exited is applied
          CSS_TRANSITION_DURATION + (CSS_TRANSITION_DURATION * .1),
        )
      },
    )

    return null
  }

  hashChangeHandler = () => {
    const hash = this.url.getStep()

    if (hash !== this.state.step + 1) {
      this.goToStep(hash - 1)
    }
  }

  lastStep = () => {
    this.goToStep(this.props.children.length - 1)
  }

  nextStep = () => {
    if (!this.props.children[this.state.step + 1]) {
      return this.complete()
    }

    return this.goToStep(this.state.step + 1)
  }

  previousStep = () => {
    if (this.props.children[this.state.step - 1]) {
      this.goToStep(this.state.step - 1)
    }
  }

  updateContainerDimensions = () => {
    if (
      this.containerRef &&
      (this.containerRef.offsetHeight !== this.state.containerHeight ||
        this.containerRef.offsetWidth !== this.state.containerWidth)
    ) {
      this.setState({
        containerHeight: this.containerRef.offsetHeight,
        containerWidth: this.containerRef.offsetWidth,
      })
    }
  }

  updateHash = () => this.url.setStep(this.state.step + 1)

  render() {
    const {
      containerHeight,
      containerWidth,
      exitDirection,
      step,
      transitioning,
    } = this.state

    const { transitionDirection } = this.props

    if (!this.props.children || !this.props.children.length) return null

    return (
      <div
        className={Styles['react-view-flow-container']}
        ref={el => (this.containerRef = el)}
      >
        {this.getStepComponentWithProps(step, {
          exitDirection,
          parentDimensions: {
            height: containerHeight,
            width: containerWidth,
          },
          setContainerDimensions: this.setContainerDimensions,
          show: !transitioning,
          transitionDirection,
        })}
      </div>
    )
  }
}

ViewFlow.propTypes = {
  children: PropTypes.node,
  initialStep: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  hashKey: PropTypes.string,
  noAnimation: PropTypes.bool,
  onComplete: PropTypes.func,
  onStep: PropTypes.func,
  instance: PropTypes.func,
  transitionDirection: PropTypes.oneOf(['horizontal', 'vertical']),
  withHashState: PropTypes.bool,
}
ViewFlow.defaultProps = {
  children: [],
  initialStep: 1,
  hashKey: 'step',
  noAnimation: false,
  onComplete: null,
  onStep: null,
  instance: null,
  transitionDirection: 'horizontal',
  withHashState: false,
}

export default ViewFlow
