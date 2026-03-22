/**
 * Booking management form with integrated asset and optional project selection.
 * Handles primary rental details and initial payment/return status.
 */
import { memo, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import Input from '../../components/ui/Input'
import Select from '../../components/ui/Select'
import { BookingSchema } from '../../schema/Booking.Schema'
import { getRequest } from '../../api/api'

const BookingForm = memo(({ data, handleBooking }) => {
  const [assets, setAssets] = useState([])
  const [projects, setProjects] = useState([])
  const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm({
    resolver: zodResolver(BookingSchema),
    defaultValues: {
      ...data,
      project: data.project?._id || data.project || '',
      rented_date: data.rented_date ? new Date(data.rented_date).toISOString().split('T')[0] : '',
      returned_date: data.returned_date ? new Date(data.returned_date).toISOString().split('T')[0] : '',
    }
  })

  useEffect(() => {
    const fetchData = async () => {
      const [assetRes, projectRes] = await Promise.all([
        getRequest('/assets?limit=100'),
        getRequest('/project?limit=100')
      ])
      if (assetRes.success) setAssets(assetRes.data.assets)
      if (projectRes.success) setProjects(projectRes.data.projects)
    }
    fetchData()
  }, [])

  return (
    <form onSubmit={handleSubmit(handleBooking)}>
      <Select
        name="asset"
        placeholder="Select Asset"
        setValue={setValue}
        options={assets.map(a => ({ label: a.name, value: a._id }))}
        error={errors}
        value={watch('asset')}
      />
      <Select
        name="project"
        placeholder="Link to Project (optional)"
        setValue={setValue}
        options={[
          { label: 'None', value: '' },
          ...projects.map(p => ({ label: p.name, value: p._id }))
        ]}
        error={errors}
        value={watch('project')}
      />
      <Input
        type='text'
        name='customer_name'
        placeholder='Enter customer name'
        register={register}
        error={errors}
      />
      <Input
        type='number'
        name='phone_number'
        placeholder='Enter phone number'
        register={register}
        error={errors}
      />
      <Input
        type='number'
        name='total_Amount'
        placeholder='Enter total amount'
        register={register}
        error={errors}
      />
      <div className="form-group">
        <label>Rented Date</label>
        <Input
          type='date'
          name='rented_date'
          register={register}
          error={errors}
        />
      </div>
      <div className="form-group">
        <label>Returned Date</label>
        <Input
          type='date'
          name='returned_date'
          register={register}
          error={errors}
        />
      </div>
      <Select
        name="returned_status"
        placeholder="Select Returned Status"
        setValue={setValue}
        options={[
          { label: 'Pending', value: 'pending' },
          { label: 'Returned', value: 'returned' }
        ]}
        error={errors}
        value={watch('returned_status')}
      />
      <Select
        name="payment_status"
        placeholder="Select Payment Status"
        setValue={setValue}
        options={[
          { label: 'Pending', value: 'pending' },
          { label: 'Partial', value: 'partial' },
          { label: 'Paid', value: 'paid' }
        ]}
        error={errors}
        value={watch('payment_status')}
      />
      <button type="submit">Save Booking</button>
    </form>
  )
})

export default BookingForm
