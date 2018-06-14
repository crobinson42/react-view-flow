# React View Flow

Credit due: forked from this awesome project [react-step-wizard](https://github.com/jcmcneal/react-step-wizard)

[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)

### Install

---

```
npm install react-view-flow
```

### Import Component

---

```javascript
import { ViewFlow, Step } from "react-view-flow";
```

### Use

---

Simply create a wrapper with `<ViewFlow></ViewFlow>` and then add each step as
it's own component wrapped in `<Step></Step>`

```html
<ViewFlow>
    <Step><Step1 /></Step>
    <Step><Step2 /></Step>
    <Step><Step.. /></Step>
    <Step><Step..12 /></Step>
    <Step><WhateverComponentName /></Step>
  </ViewFlow>
</section>
```

### Props

---

Each step has access to it's parent `<ViewFlow />` state via `props`

For example:

```html
<div>
  <h2>Step {this.props.currentStep}</h2>
  <p>Total Steps: {this.props.totalSteps}</p>
  <p><button onClick={this.props.previousStep}>Previous Step</button></p>
  <p><button onClick={this.props.nextStep}>Next Step</button></p>
  <p><button onClick={() => this.props.goToStep(2)}>Step 2</button></p>
  <p><button onClick={this.props.firstStep}>First Step</button></p>
  <p><button onClick={this.props.lastStep}>Last Step</button></p>
</div>
```

### Transitions

---

The default transitions are using CSS taken from [animate.css](https://daneden.github.io/animate.css/). You can override the transitions by passing in custom CSS classes to the `transitions` prop in `<ViewFlow>`.

```html
let custom = {
  enterRight: 'your custom css transition classes',
  enterLeft : 'your custom css transition classes',
  exitRight : 'your custom css transition classes',
  exitLeft  : 'your custom css transition classes'
}
<ViewFlow transitions={custom}>...</ViewFlow>
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
