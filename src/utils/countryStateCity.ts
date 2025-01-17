import { Country, State } from 'country-state-city'

export function getCountries() {
  return Country.getAllCountries().map(({ name, isoCode }) => ({
    label: name,
    value: isoCode,
  }))
}

export function getStateOfCountry(countryCode: string) {
  return State.getStatesOfCountry(countryCode).map(({ name, isoCode }) => ({
    label: name,
    value: isoCode,
  }))
}

export function isValidState(stateCode: string, countryCode: string): boolean {
  return State.getStateByCodeAndCountry(stateCode, countryCode) !== undefined
}
