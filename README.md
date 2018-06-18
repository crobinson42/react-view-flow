# React View Flow

A view/screen/component stepper with optional transition animations and URL hash state. Very flexible and extendable
through suedo-controlled component API.

_Inspired by this awesome project [react-step-wizard](https://github.com/jcmcneal/react-step-wizard)_

[![npm version](https://badge.fury.io/js/react-view-flow.svg)](https://badge.fury.io/js/react-view-flow)
[![Build Status](https://travis-ci.org/crobinson42/react-view-flow.svg?branch=master)](https://travis-ci.org/crobinson42/react-view-flow)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)
[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)

![2018-06-18 10 09 00](https://user-images.githubusercontent.com/5973579/41551092-ab56e34c-72df-11e8-964a-412595b1a857.gif)

## Getting Started

```
npm install react-view-flow

// or using yarn

yarn add react-view-flow
```

```javascript
import { ViewFlow, Step } from 'react-view-flow'
```

## Examples

```jsx
<ViewFlow>
  <Step>
    <MyFirstScreen />
  </Step>
  <Step>
    <MySecondScreen />
  </Step>
  <Step>
    <SomeOtherComponent />
  </Step>
  ...
</ViewFlow>
```

#### Your app defines the step screens and is handed down props to control the flow

```jsx
import React from 'react'

const MyFirstScreen = ({ currentStep, nextStep }) => (
    <div>
        <h1>Step # {currentStep}</h1>
        
        <button onClick={nextStep}>Next</button>
    </div>
)

const MySecondScreen = ({ currentStep, nextStep, previousStep }) => (
    <div>
        <h1>Step # {currentStep}</h1>
        
        <button onClick={previousStep}>Back</button>
        {' '}
        <button onClick={nextStep}>Next</button>
    </div>
)

const ExampleFlow = () => (
    <ViewFlow>
      <Step>
        <MyFirstScreen />
      </Step>
      
      <Step>
        <MySecondScreen />
      </Step>
    </ViewFlow>
)
```

#### All `<ViewFlow />` Props

```jsx
<ViewFlow
  hashKey="step"
  initialStep="2"
  noAnimation
  onComplete={() => {
    /* fired after last step */
  }}
  onStep={() => {
    /* fired on step change */
  }}
  ref={el => (this.viewflowRef = el)}
  transitionDirection="horizontal"
  withHashState
>
  <Step>
    <MyFirstScreen />
  </Step>
  <Step>
    <MySecondScreen />
  </Step>
  <Step>
    <SomeOtherComponent />
  </Step>
  ...
</ViewFlow>
```

> More examples in `example/` directory. Easy to run locally, pull the git repo then run `npm i && npm run dev` -> `http://localhost:8080`

## `<ViewFlow />` Component

The `<ViewFlow />` component is the meat and potatoes of this lib. The `<ViewFlow />`
component must only contain `<Step />` components as children.

#### Props

| Name          | Default                         | Type    | Description                                  |
| ------------- | ------------------------------- | ------- | -------------------------------------------- |
| `initialStep`   | `1`                         | Number, String |
| `hashKey`   | `step`                         | String | The default key to use in url hash if prop `withHashState` is true
| `noAnimation`   | `false`                         | Boolean | Do not show animations on step transitions
| `onComplete`   | `() => void`                         | Function | A callback that is fired when `nextStep()` is called and there are no more steps
| `onStep`   | `(stepNumber) => void`                         | Function | A callback that is fired after step change
| `ref`        | `({ complete: Function, currentStep: Number, firstStep: Function, goToStep: Function, lastStep: Function, nextStep: Function, previousStep: Function, totalSteps: Number }) => void`                             | Function  | A callback fired with an object of methods to manipulate the `<ViewFlow />` instance 
| `transitionDirection` | 'horizontal' | String, `horizontal` or `vertical`  | Optionally set the direction of transition animations     |
| `withHashState` | 'false' | Boolean  | Keep the step state in the URL hash |

## `<Step />` Component

The `<Step />` component must be a child of `<ViewFlow />` and must also contain a
child component.

#### Props

| Name | Default | Type | Description |
| ---- | ------- | ---- | ----------- |
| `currentStep` | Number | Number | The step number
| `firstStep` | `() => void` | Func | Method to go to the first step
| `goToStep` | `() => void` | Func | Method to go to a specific step number
| `lastStep` | `() => void` | Func | Method to go to the last step
| `nextStep` | `() => void` | Func | Method to go to the next step
| `previousStep` | `() => void` | Func | Method to go to the previous step
| `totalSteps` | Number | Number | The number of steps in the `<ViewFlow />` container

## `<Step />` Child Component Props

The child component of each `<Step />` has access to it's parent `<ViewFlow />`
state via `props`.

```jsx
// MyStepComponent.jsx

import React from 'react'

const MyStepComponent = props => (
  <div>
    <h1>Step {props.currentStep}</h1>

    <div>Total Steps: {props.totalSteps}</div>

    <button onClick={props.previousStep}>Previous Step</button>

    <button onClick={props.nextStep}>Next Step</button>

    <button onClick={() => props.goToStep(2)}>Step 2</button>

    <button onClick={props.firstStep}>First Step</button>

    <button onClick={props.lastStep}>Last Step</button>
  </div>
)

export default MyStepComponent
```
