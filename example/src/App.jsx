import React from 'react'

import ViewFlow from '../../src/components/ViewFlow'
import Step from '../../src/components/Step'

const StepMaker = numb => ({ currentStep, nextStep, previousStep }) => {
  return (
    <div>
      <span>Step # {currentStep}</span>
    </div>
  )
}
const Step1 = StepMaker(1)
const Step2 = StepMaker(2)
const Step3 = StepMaker(3)
const Step4 = StepMaker(4)

class Example extends React.Component {
  nextStep = () => {
    this.viewFlowRef.nextStep()
  }

  previousStep = () => {
    this.viewFlowRef.previousStep()
  }

  render() {
    return (
      <div style={{ border: 'solid 1px black', marginLeft: '20%', width: '300px' }}>
        <h1>React View Flow - Example</h1>

        <ViewFlow ref={el => (this.viewFlowRef = el)} withHashState>
          <Step>
            <Step1 />
          </Step>

          <Step>
            <Step2 />
          </Step>

          <Step>
            <Step3 />
          </Step>

          <Step>
            <Step4 />
          </Step>
        </ViewFlow>



        <div>
            <button onClick={this.previousStep}>Previous</button>{' '}
            <button onClick={this.nextStep}>Next</button>
        </div>
      </div>
    )
  }
}

Example.propTypes = {}
Example.defaultProps = {}

export default Example
