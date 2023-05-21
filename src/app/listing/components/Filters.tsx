import { FC } from 'react'
import { Input } from './Input'
import { Select } from './Select'

export const Filters: FC = () => {
  return (
    <aside className="relative top-0 lg:sticky lg:top-7 2xl:top-8">
      <div className="card grid grid-cols-2 gap-2 bg-base-100 p-3 shadow-md lg:p-5 xl:p-6">
        <div className="col-span-2">
          <Input placeholder="Search..." />
        </div>
        <div className="divider col-span-2 mt-6">Filters</div>
        <div className="col-span-2">
          <Select
            label="Type"
            options={[
              { label: 'Car', value: 'Car' },
              { label: 'SUV', value: 'SUV' },
              { label: 'Van', value: 'Van' },
            ]}
            selectClassName="select-sm"
            placeholder="All Types"
            selectablePlaceholder
          />
        </div>
        <div className="col-span-2">
          <Select
            label="City"
            options={[
              { label: 'Colombo', value: 'Colombo' },
              { label: 'Galle', value: 'Galle' },
            ]}
            selectClassName="select-sm"
            placeholder="All Cities"
            selectablePlaceholder
          />
        </div>
        <div className="col-span-1 lg:col-span-2 xl:col-span-1">
          <Input label="Minimum Price" type="number" placeholder="Minimum Price" min={0} inputClassNames="input-sm" />
        </div>
        <div className="col-span-1 lg:col-span-2 xl:col-span-1">
          <Input label="Maximum Price" type="number" placeholder="Maximum Price" min={0} inputClassNames="input-sm" />
        </div>
        <div className="col-span-1 lg:col-span-2 xl:col-span-1">
          <Input label="Manufactured From" type="number" placeholder="1990" min={0} inputClassNames="input-sm" />
        </div>
        <div className="col-span-1 lg:col-span-2 xl:col-span-1">
          <Input label="Manufactured Upto" type="number" placeholder="2023" min={0} max={new Date().getFullYear()} inputClassNames="input-sm" />
        </div>
        <div className="col-span-2">
          <Select
            label="Condition"
            options={[
              { label: 'New', value: 'New' },
              { label: 'Used', value: 'Used' },
              { label: 'Refurbished', value: 'Refurbished' },
            ]}
            selectClassName="select-sm"
            placeholder="Any Condition"
            selectablePlaceholder
          />
        </div>
        <div className="col-span-1 lg:col-span-2">
          <Select
            label="Fuel Type"
            options={[
              { label: 'Petrol', value: 'Petrol' },
              { label: 'Diesel', value: 'Diesel' },
              { label: 'Hybrid', value: 'Hybrid' },
              { label: 'Electric', value: 'Electric' },
              { label: 'Other', value: 'Other' },
            ]}
            selectClassName="select-sm"
            placeholder="Any Fuel Type"
            selectablePlaceholder
          />
        </div>
        <div className="col-span-1 lg:col-span-2">
          <Select
            label="Transmission Type"
            options={[
              { label: 'Automatic', value: 'Automatic' },
              { label: 'Manual', value: 'Manual' },
              { label: 'Tiptronic', value: 'Tiptronic' },
              { label: 'Other', value: 'Other' },
            ]}
            selectClassName="select-sm"
            placeholder="Any Type"
            selectablePlaceholder
          />
        </div>
        <button className="btn-ghost btn col-span-2 mt-5">Reset</button>
      </div>
    </aside>
  )
}
