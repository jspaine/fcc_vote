import React from 'react'
import {connect} from 'react-redux'
import {reduxForm, Field, FieldArray} from 'redux-form'
import {Button, IconButton} from 'react-toolbox/lib/button'
import {Card, CardTitle, CardActions} from 'react-toolbox/lib/card'

import {savePollRequest} from 'store/modules/polls'
import RTField from 'components/RTField'
import validate from './validate'
import style from './EditPoll.scss'

const RenderOptions = ({fields}) =>
  <ul>
    <li className={style.fieldListItem}>
      <Button
        type="button"
        label="Add Option"
        accent
        onClick={() => fields.push({title: ''})}
      />
    </li>
    {fields.map((option, index) =>
      <li className={style.fieldListItem} key={index}>
        <Field
          name={`${option}.title`}
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

const EditPoll = ({initialValues, handleSubmit, onSubmit}) =>
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
          <Button type="submit" onClick={handleSubmit(onSubmit)} raised primary>
            Ok
          </Button>
        </div>
        <div className={style.formCol}>
          <FieldArray
            name="options"
            component={RenderOptions}
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
      options: [{title: ''},{title: ''}]
    },
    saving: state.polls.pending
  }),
  dispatch => ({
    onSubmit: data => dispatch(saveRequest(data))
  })
)(WithForm)
