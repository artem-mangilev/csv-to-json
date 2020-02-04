let minify

/**
 * returns error string if csv is invalid, otherwise returns 'valid'.
 */
function validateCsv(csv) {
  // check if each record have the same number of fields.
  const requiredNumberOfFields = csv[0].length

  for (let i = 0; i < csv.length; i += 1) {
    if (requiredNumberOfFields !== csv[i].length) {
      return `The record at line ${i + 1} must have ${requiredNumberOfFields} fields!`
    }
  }

  return 'valid'
}

/**
 *  changes type between number and string
 */
function changeTypeIfNeeded(value) {
  const numberValue = parseFloat(value)

  // eslint-disable-next-line no-restricted-globals
  if (isNaN(numberValue)) {
    return `"${value}"`
  }
  return numberValue
}

function jsonArray(elements) {
  return `[${minify ? '' : '\n'}${elements.join(',\n')}${minify ? '' : '\n'}]`
}

function jsonObject(keys, values) {
  let json = `${minify ? '' : '\t'}{`
  json += minify ? '' : '\n'

  for (let i = 0; i < keys.length; i += 1) {
    json += `${minify ? '' : '\t\t'}`
    json += `"${keys[i]}":${changeTypeIfNeeded(values[i])}`

    // don't put comma after last key-value pair
    if (!(i === keys.length - 1)) {
      json += ','
    }

    json += minify ? '' : '\n'
  }

  json += minify ? '' : '\t'
  json += '}'

  return json
}

function buildJson(csvHeader, csvRows) {
  const jsonObjects = []

  for (let i = 0; i < csvRows.length; i += 1) {
    const row = csvRows[i]

    jsonObjects.push(jsonObject(csvHeader, row))
  }

  return jsonArray(jsonObjects)
}

export default function convertCsvToJson(csv, options) {
  minify = options.minify

  const { separator } = options
  const splittedCsv = csv.split('\n').map((row) => row.split(separator))

  const header = splittedCsv[0]
  const rows = splittedCsv.slice(1)

  // validate csv
  const message = validateCsv(splittedCsv)
  if (message === 'valid') {
    return buildJson(header, rows)
  }
  // eslint-disable-next-line no-console
  // console.log(message)
}
