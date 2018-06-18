import React from 'react'

import ViewFlow from '../../src/components/ViewFlow'
import Step from '../../src/components/Step'

const StepMaker = numb => ({ currentStep, nextStep, previousStep }) => {
  return (
    <div>
      <h4>Step # {currentStep}</h4>
      {currentStep - 1 > 0 && (
        <button onClick={previousStep}>Previous {currentStep - 1}</button>
      )}
      <button onClick={nextStep}>Go to step {currentStep + 1}</button>
    </div>
  )
}
const Step1 = StepMaker(1)
const Step2 = StepMaker(2)
const Step3 = StepMaker(3)
const Step4 = StepMaker(4)

const Example = () => (
  <div>
    <h1>React View Flow - Example</h1>

    <div
      style={{
        backgroundColor: 'grey',
        paddingTop: '200px',
        position: 'relative',
        marginLeft: 'auto',
        marginRight: 'auto',
        width: '300px',
      }}
    >
      <ViewFlow withHashState>
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
    </div>
  </div>
)

Example.propTypes = {}
Example.defaultProps = {}

export default Example
