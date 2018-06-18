# React View Flow

Credit due: inspiration from this awesome project [react-step-wizard](https://github.com/jcmcneal/react-step-wizard)

[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)

## Getting Started

```
npm install react-view-flow

// or using yarn

yarn add react-view-flow
```

```javascript
import { ViewFlow, Step } from 'react-view-flow'
```

## Example

```html
<ViewFlow>
    <Step><MyFirstScreen /></Step>

    <Step><MySecondScreen /></Step>

    <Step><SomeOtherComponent /></Step>

    ...
</ViewFlow>
```

> More examples in `example/` directory

## `<ViewFlow />` Component

The `<ViewFlow />` component is the meat and potatoes of this lib. The `<ViewFlow />`
component must only contain `<Step />` components as children.

#### Props

| Name          | Default                         | Type   | Description                              |
| ------------- | ------------------------------- | ------ | ---------------------------------------- |
| `hashState` | `false` | Boolean | Use url hash to store the current step state |
|  |  |  |
| `step` | `1` | Number | The actively rendered component |
| `transitions` | Animate.css (see example below) | Object | The class names to apply for transitions |

#### `<ViewFlow />` `transitions` Prop

By default `react-view-flow` provides animated transitions applied to step changes
using the [animate.css](https://daneden.github.io/animate.css/) lib. You can override
the transitions by passing in custom CSS classes to the `transitions` prop in
`<ViewFlow>`.

```jsx
<ViewFlow
  transitions={{
    enterRight: 'custom-transition-class-from-right',
    enterLeft: 'custom-transition-class-from-left',
    exitRight: 'custom-transition-class-to-right',
    exitLeft: 'custom-transition-class-to-left',
  }}
>
  ...
</ViewFlow>
```

## `<Step />` Component

The `<Step />` component must be a child of `<ViewFlow />` and must also contain a
child component.

#### Props

| Name | Default | Type | Description |
| ---- | ------- | ---- | ----------- |
|      |         |      |
|      |         |      |

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

### Initial Step

---

The order of your steps in JSX will be loaded in the same order in the browser.
However, you may specify which step to start on by passing in the `active`
prop to `<Step>`. This doesn't reorder it to be first but rather skips directly
to it on start.

```html
<Step active><Step7 /></Step>
```

\*Neglecting to pass in the `active` prop will result in the first component displaying first.
