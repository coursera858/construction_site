/**
 * Project management form.
 * Handles project creation and editing with Zod + RHF validation.
 */
import { memo } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import Input from '../../components/ui/Input'
import Select from '../../components/ui/Select'
import { ProjectSchema } from '../../schema/Project.Schema'

const ProjectForm = memo(({ data, handleProject }) => {
  const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm({
    resolver: zodResolver(ProjectSchema),
    defaultValues: {
      ...data,
    }
  })

  return (
    <form onSubmit={handleSubmit(handleProject)}>
      <Input
        type='text'
        name='name'
        placeholder='Project Name'
        register={register}
        error={errors}
      />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
        <Input
          type='text'
          name='client_name'
          placeholder='Client Name'
          register={register}
          error={errors}
        />
        <Input
          type='number'
          name='phone_number'
          placeholder='Phone Number'
          register={register}
          error={errors}
        />
      </div>
      <Input
        type='text'
        name='address'
        placeholder='Address'
        register={register}
        error={errors}
      />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
        <Select
          name="work_status"
          placeholder="Work Status"
          setValue={setValue}
          options={[
            { label: 'Planning', value: 'planning' },
            { label: 'In Progress', value: 'in_progress' },
            { label: 'Completed', value: 'completed' }
          ]}
          error={errors}
          value={watch('work_status')}
        />
        <Select
          name="payment_status"
          placeholder="Payment Status"
          setValue={setValue}
          options={[
            { label: 'Pending', value: 'pending' },
            { label: 'Partial', value: 'partial' },
            { label: 'Paid', value: 'paid' }
          ]}
          error={errors}
          value={watch('payment_status')}
        />
      </div>
      <button type="submit">Save Project</button>
    </form>
  )
})

export default ProjectForm
