import React from 'react'
import search from './search.svg'

interface TableSearchBarProps {
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}

const TableSearchBar = ({ onChange }: TableSearchBarProps) => {
  return (
    <>
      <div className="flex mb-5 py-[7px] px-3 bg-[white] rounded-md ">
        <input type="text" className="border-none outline-none" placeholder={'Search'} onChange={onChange} />
        <img src={search} alt="search" />
      </div>
    </>
  )
}

export default TableSearchBar
