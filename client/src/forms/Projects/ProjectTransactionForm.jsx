/**
 * Project Transaction Form.
 * Manages individual income and expense entries for a specific project.
 */
import { memo } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import Input from '../../components/ui/Input'
import Select from '../../components/ui/Select'
import TextArea from '../../components/ui/TextArea'
import { ProjectTransactionSchema } from '../../schema/ProjectTransaction.Schema'

const ProjectTransactionForm = memo(({ data, handleTransaction }) => {
  const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm({
    resolver: zodResolver(ProjectTransactionSchema),
    defaultValues: {
      ...data,
      date: data.date ? new Date(data.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
    }
  })

  return (
    <form onSubmit={handleSubmit(handleTransaction)}>
      <Select
        name="type"
        placeholder="Select Type"
        setValue={setValue}
        options={[
          { label: 'Income (Payment)', value: 'income' },
          { label: 'Expense', value: 'expense' }
        ]}
        error={errors}
        value={watch('type')}
      />
      <Select
        name="category"
        placeholder="Select Category"
        setValue={setValue}
        options={[
          { label: 'Labour', value: 'labour' },
          { label: 'Material', value: 'material' },
          { label: 'Transport', value: 'transport' },
          { label: 'Client Payment', value: 'client payment' }
        ]}
        error={errors}
        value={watch('category')}
      />
      <Input
        type='number'
        name='amount'
        placeholder='Enter amount'
        register={register}
        error={errors}
      />
      <div className="form-group">
        <label>Date</label>
        <Input
          type='date'
          name='date'
          register={register}
          error={errors}
        />
      </div>
      <Select
        name="payment_type"
        placeholder="Select Payment Type"
        setValue={setValue}
        options={[
          { label: 'Cash', value: 'cash' },
          { label: 'Cheque', value: 'cheque' },
          { label: 'PhonePe', value: 'phonepay' }
        ]}
        error={errors}
        value={watch('payment_type')}
      />
      <TextArea
        name='description'
        placeholder='Enter description (optional)'
        register={register}
        error={errors}
      />
      <button type="submit">Save Transaction</button>
    </form>
  )
})

export default ProjectTransactionForm
