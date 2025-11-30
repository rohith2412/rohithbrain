import React from 'react'
import ListButton from './ListButton'
import Link from 'next/link'

const List = () => {


  return (
    <div className='grid justify-center gap-10'>
      <Link href={"/fish-curry"} className=''>
        <ListButton text="fish-curry "  />
      </Link>

      <Link href={"/holiday-budget-inflation-survival-guide-2025"} className=''>
        <ListButton text="holiday-budget-inflation-survival-guide-2025 "  />
      </Link>

      <Link href={"/holiday-budget-planning-2025"} className=''>
        <ListButton text="holiday-budget-planning-2025 "  />
      </Link>

      <Link href={"/longevity-diet-habits-aging"} className=''>
        <ListButton text="longevity-diet-habits-aging "  />
      </Link>

      <Link href={"/mental-health-winter-wellness-tips"} className=''>
        <ListButton text="mental-health-winter-wellness-tips "  />
      </Link>

      <Link href={"/remote-work-burnout-prevention-strategies"} className=''>
        <ListButton text="remote-work-burnout-prevention-strategies "  />
      </Link>

      <Link href={"/save-money-fast"} className=''>
        <ListButton text="save-money-fast "  />
      </Link>

      <Link href={"/sustainable-investing-strategies-2025"} className=''>
        <ListButton text="sustainable-investing-strategies-2025 "  />
      </Link>
    </div>
  )
}

export default List
