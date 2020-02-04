import { saveAs } from 'file-saver'

import convertCsvToJson from './converter'

const csvInput = document.getElementById('csv-input')
const jsonOutput = document.getElementById('json-output')
const fileNameInput = document.getElementById('file-name')
const csvFileInput = document.getElementById('csv-file-input')
const convertButton = document.getElementById('convert-button')
const saveButton = document.getElementById('save-button')
const copyButton = document.getElementById('copy-button')
const minifyCheckbox = document.getElementById('minify')

convertButton.onclick = () => {
  const minify = minifyCheckbox.checked

  const json = convertCsvToJson(csvInput.value, {
    minify,
    separator: ', ',
  })

  jsonOutput.value = json
}


csvFileInput.onchange = (fileInputEvent) => {
  const { files } = fileInputEvent.target

  if (files.length === 0) {
    alert('You should choose the file!')
    return
  }

  // eslint-disable-next-line compat/compat
  const reader = new FileReader()

  reader.readAsText(files[0])

  reader.onload = (fileReaderEvent) => {
    const csv = fileReaderEvent.target.result

    csvInput.value = ''
    csvInput.value = csv
  }
}

saveButton.onclick = () => {
  const fileName = fileNameInput.value

  const file = new File([jsonOutput.value], `${fileName}.json`, {
    type: 'application/json',
  })

  saveAs(file)
}

copyButton.onclick = () => {
  jsonOutput.select()
  document.execCommand('copy')
}
