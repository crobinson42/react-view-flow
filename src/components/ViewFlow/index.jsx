// @flow
import * as React from 'react'
import PropTypes from 'prop-types'

import { CSS_TRANSITION_DURATION } from '../../contants'
import Url from '../../util/url'

import Styles from '../../styles/index.css'

type ViewFlowProps = {
  children: Array<React.Node>,
  initialStep: number | string,
  hashKey: string,
  maintainHashKey: boolean,
  noAnimation: boolean,
  onComplete: () => any,
  onStep: (number | string) => any,
  instance: Object => any,
  transitionDirection: string,
  withHashState: boolean,
}

type ViewFlowState = {
  containerHeight: number,
  containerWidth: number,
  step: number,
  transitioning: boolean,
  exitDirection: string,
}

class ViewFlow extends React.Component<ViewFlowProps, ViewFlowState> {
  static propTypes = {
    children: PropTypes.node,
    initialStep: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    hashKey: PropTypes.string,
    maintainHashKey: PropTypes.bool,
    noAnimation: PropTypes.bool,
    onComplete: PropTypes.func,
    onStep: PropTypes.func,
    instance: PropTypes.func,
    transitionDirection: PropTypes.oneOf(['horizontal', 'vertical']),
    withHashState: PropTypes.bool,
  }

  static defaultProps = {
    children: [],
    initialStep: 1,
    hashKey: 'step',
    maintainHashKey: false,
    noAnimation: false,
    onComplete: null,
    onStep: null,
    instance: null,
    transitionDirection: 'horizontal',
    withHashState: false,
  }

  constructor(props: ViewFlowProps) {
    super(props)

    this.url = new Url({ hashKey: props.hashKey })

    const step =
      (props.withHashState && +this.url.getStep() - 1) ||
      typeof props.initialStep === 'string'
        ? this.getStepIndexFromId(String(this.props.initialStep))
        : +this.props.initialStep - 1 || 0

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
      this.props.instance(this.getInstanceApi())
    }

    if (this.props.withHashState) {
      if (this.props.hashKey) {
        this.url.setHashKey(this.props.hashKey)
      }

      this.updateHash()

      window.addEventListener('hashchange', this.hashChangeHandler)
    }
  }

  componentDidUpdate(prevProps: ViewFlowProps, prevState: ViewFlowState) {
    this.updateContainerDimensions()

    if (prevState.step !== this.state.step) {
      if (this.props.onStep) {
        const stepNumber = this.state.step + 1
        this.props.onStep(
          this.getStepIdFromIndex(this.state.step) || stepNumber,
        )
      }

      if (this.props.withHashState) {
        this.updateHash()
      }
    }
  }

  componentWillUnmount() {
    if (this.props.withHashState) {
      window.removeEventListener('hashchange', this.hashChangeHandler)
      if (!this.props.maintainHashKey) this.url.clearHash()
    }
  }

  getInstanceApi = () => {
    const self = this

    return {
      __ViewFlow: this,
      complete: this.complete,
      get currentStep() {
        const currentIndex = self.state.step

        if (self.getStepIdFromIndex(currentIndex))
          return self.getStepIdFromIndex(currentIndex)

        return currentIndex + 1
      },
      firstStep: this.firstStep,
      goToStep: (step: number | string) => {
        if (
          typeof step === 'string' &&
          typeof this.getStepIndexFromId(step) === 'number'
        )
          this.goToStep(this.getStepIndexFromId(step))
        else if (typeof step === 'number') this.goToStep(step - 1)
        else
          // eslint-disable-next-line no-console
          console.warn(
            `<ViewFlow/> gotToStep(string | number) incompatible typeof "${typeof step}"`,
          )
      },
      lastStep: this.lastStep,
      nextStep: this.nextStep,
      previousStep: this.previousStep,
      totalSteps: this.props.children.length,
    }
  }

  getStepComponentWithProps = (stepIndex: number, addProps: Object) => {
    if (isNaN(+stepIndex)) {
      // eslint-disable-next-line no-console
      console.warn(
        `<ViewFlow /> step ${stepIndex} is not valid, must be a Number`,
      )

      return null
    }

    const children = React.Children.toArray(this.props.children)
    const { containerHeight, containerWidth } = this.state

    if (!children.length || !children[stepIndex]) {
      return null
    }

    const props = {
      ...addProps,
      ...this.getInstanceApi(),
      parentDimensions: {
        height: containerHeight,
        width: containerWidth,
      },
      setContainerDimensions: this.setContainerDimensions,
    }

    return React.cloneElement(children[stepIndex], {
      ...props,
    })
  }

  getStepIdFromIndex = (stepIndex: number) => {
    const child = this.props.children[stepIndex]

    // $FlowFixMe
    if (child && child.props.id) return child.props.id

    return undefined
  }

  getStepIndexFromId: string => number = id => {
    const stepIndex = React.Children.toArray(this.props.children).reduce(
      (acc: null | number, step: Object, index: number) => {
        // eslint-disable-next-line no-param-reassign
        if (step.props && step.props.id === id) acc = index

        return acc
      },
      null,
    )

    if (typeof stepIndex !== 'number')
      throw new Error(`<ViewFlow> step id cannot be found: ${id}`)

    return stepIndex
  }

  setContainerDimensions = (heightInt: number, widthInt: number) => {
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
        containerHeight: heightInt,
        containerWidth: widthInt,
      },
      () => {
        // this.containerRef.style.height = `${this.state.containerHeight}px`
        // this.containerRef.style.width = `${this.state.containerWidth}px`
      },
    )

    return null
  }

  containerRef: HTMLDivElement

  url: Url

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

  goToStep = (stepIndex: number) => {
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
          CSS_TRANSITION_DURATION + CSS_TRANSITION_DURATION * 0.1,
        )
      },
    )

    return null
  }

  hashChangeHandler = () => {
    const hash = +this.url.getStep()
    if (typeof hash !== 'number') {
      console.error(
        `<ViewFlow> hashChangeHandler() hash cannot be coerced to a number, ${this.url.getStep()}`,
      )
    } else if (!isNaN(hash) && hash !== this.state.step + 1) {
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

  updateHash = () => {
    this.url.setStep(this.state.step + 1)
  }

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
        // $FlowFixMe
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

export default ViewFlow
