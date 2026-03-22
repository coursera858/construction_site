/**
 * User interface for adding or editing asset data.
 * Includes image upload support and searchable asset categorization.
 */
import { memo } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import Input from '../../components/ui/Input'
import Image from '../../components/ui/Image'
import Select from '../../components/ui/Select'
import TextArea from '../../components/ui/TextArea'
import { AssetSchema } from '../../schema/Asset.Schema'

const AssetForm = memo(({ data, handleAsset }) => {
  const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm({
    resolver: zodResolver(AssetSchema),
    defaultValues: data
  })

  return (
    <form onSubmit={handleSubmit(handleAsset)}>
      <Input
        type='text'
        name='name'
        placeholder='Enter asset name'
        register={register}
        error={errors}       
      />
      <Select
        name="asset_type"
        placeholder="Select Asset Type"
        setValue={setValue}
        options={['vehicle', 'tools']}
        error={errors}
        value={watch('asset_type')}
      />
      <Input
        type='number'
        name='count'
        placeholder='Enter quantity'
        register={register}
        error={errors}
      />
      <Image
        name="image"
        setValue={setValue}
        error={errors}
      />
      <TextArea
        name='description'
        placeholder='Enter asset description'
        register={register}
        error={errors}
      />
      <button type="submit">Save Asset</button>
    </form>
  )
})

export default AssetForm