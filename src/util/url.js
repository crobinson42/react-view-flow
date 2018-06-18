import qs from 'query-string'

let HASH_KEY = 'step'

function clearHash() {
  // eslint-disable-next-line no-use-before-define
  const hash = getHashObject()

  delete hash[HASH_KEY]

  // eslint-disable-next-line no-restricted-globals
  location.hash = qs.stringify(hash)
}

function getHashObject() {
  // eslint-disable-next-line no-restricted-globals
  return qs.parse(location.hash)
}

function getStep() {
  return getHashObject()[HASH_KEY]
}

function setHashKey(key) {
  HASH_KEY = key
}

function setHashParam(param, value) {
  const hash = getHashObject()

  hash[param] = value

  // eslint-disable-next-line no-restricted-globals
  location.hash = qs.stringify(hash)
}

function setStep(stepNumber) {
  setHashParam(HASH_KEY, stepNumber)
}

export default {
  clearHash,
  getHashObject,
  getStep,
  setHashKey,
  setHashParam,
  setStep,
}
