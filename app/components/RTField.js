import React from 'react'
import {Input} from 'react-toolbox/lib/input'

export default (field) =>
  <div>
    <Input
      {...field.input}
      label={field.label}
      error={field.meta.touched && field.meta.error ?
             field.meta.error : ''}
    />
  </div>
