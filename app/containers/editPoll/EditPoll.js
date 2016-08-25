import React from 'react'
import {connect} from 'react-redux'
import {reduxForm, Field, FieldArray} from 'redux-form'
import {Button, IconButton} from 'react-toolbox/lib/button'
import {Input} from 'react-toolbox/lib/input'
import {Card, CardTitle, CardActions} from 'react-toolbox/lib/card'

import style from './EditPoll.scss'

const RTField = field =>
  <div>
    <Input
      {...field.input}
      label={field.label}
      error={field.meta.touched && field.meta.error &&
             field.meta.error}
    />
  </div>

const renderOptions = ({fields}) =>
  <ul>
    <li className={style.fieldListItem}>
      <Button
        type="button"
        label="Add Option"
        accent
        onClick={() => fields.push('')}
      />
    </li>
    {fields.map((option, index) =>
      <li className={style.fieldListItem} key={index}>
        <Field
          name={option}
          label={`Option ${index + 1}`}
          type="text"
          component={RTField}
        />
        {fields.length > 2 &&
          <IconButton
            icon="remove_circle"
            accent
            onClick={(ev) => {
              ev.preventDefault()
              fields.remove(index)
            }}/>
        }
      </li>
    )}
  </ul>

const EditPoll = () =>
  <Card>
    <CardTitle title="New Poll"></CardTitle>
    <form action="/api/polls" method="POST">
      <div className={style.formRow}>
        <div className={style.formCol}>
          <Field
            name="title"
            label="Title"
            component={RTField}
            type="text"
          />
          <Field
            name="description"
            label="Description"
            component={RTField}
            type="text"
          />
          <Button type="submit" raised primary>
            Ok
          </Button>
        </div>
        <div className={style.formCol}>
          <FieldArray
            name="options"
            component={renderOptions}
          />
        </div>
      </div>
    </form>
  </Card>

const WithForm = reduxForm({
  form: 'EditPoll',
  validate
})(EditPoll)

export default connect(
  state => ({
    initialValues: {
      options: ['','']
    }
  })
)(WithForm)

function validate (values) {
  const errors = {
    options: []
  }
  if (!values.title || !values.title.trim()) {
    errors.title = 'Title is required'
  }
  const emptyOptions = findEmpty(values.options)
  if (values.options.length - emptyOptions.length < 2) {
    errors.options[emptyOptions[0]] =
      'At least two options are required'
  }
  return errors
}

function findEmpty(arr) {
  return arr.reduce((acc, x, i) =>
    (!x || x.trim() === '') ? acc.concat(i) : acc
  , [])
}
