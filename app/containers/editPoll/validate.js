export default function validate (values) {
  const errors = {
    options: []
  }
  if (!values.title || !values.title.trim()) {
    errors.title = 'Title is required'
  }
  const emptyOptions = findEmpty(values.options)
  if (values.options.length - emptyOptions.length < 2) {
    errors.options[emptyOptions[0]] = {
      title: 'At least two options are required'
    }
  }
  return errors
}

function findEmpty(arr) {
  return arr.reduce((acc, x, i) =>
    (!x.title || x.title.trim() === '') ? acc.concat(i) : acc
    , [])
}
