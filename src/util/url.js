// @flow
import qs from 'query-string'

type UrlProps = {
  hashKey?: string
}

export default class Url {
  HASH_KEY = 'step'

  constructor(props: UrlProps) {
    if (props.hashKey) {
      this.setHashKey(props.hashKey)
    }
  }

  clearHash = () => {
    const hash = this.getHashObject()

    delete hash[this.HASH_KEY]

    window.location.hash = qs.stringify(hash)
  }

  getHashObject: () => Object = () =>
    qs.parse(window.location.hash)

  getStep: () => string = () => this.getHashObject()[this.HASH_KEY]

  setHashKey = (key: string) => {
    this.HASH_KEY = key
  }

  setHashParam = (param: string, value: number | string) => {
    const hash = this.getHashObject()

    hash[param] = value

    window.location.hash = qs.stringify(hash)
  }

  setStep = (stepNumber: number) => {
    this.setHashParam(this.HASH_KEY, stepNumber)
  }
}
