import qs from 'query-string'

export default class Url {
  HASH_KEY = 'step'

  constructor(props) {
    if (props.hashKey) {
      this.setHashKey(props.hashKey)
    }
  }

  clearHash = () => {
    const hash = this.getHashObject()

    delete hash[this.HASH_KEY]

    window.location.hash = qs.stringify(hash)
  }

  getHashObject = () =>
    qs.parse(window.location.hash)

  getStep = () => this.getHashObject()[this.HASH_KEY]

  setHashKey = key => {
    this.HASH_KEY = key
  }

  setHashParam = (param, value) => {
    const hash = this.getHashObject()

    hash[param] = value

    window.location.hash = qs.stringify(hash)
  }

  setStep = stepNumber => {
    this.setHashParam(this.HASH_KEY, stepNumber)
  }
}
