import React, { useEffect, useState } from 'react'
import './Table.css'
import TableSearchBar from './TableSearchBar'
import { useNavigate } from 'react-router-dom'
import Pagination from './Pagination'
import { Skeleton } from '@mui/material'

interface TableProps {
  array: any[]
  label: string[]
  keysToDisplay: string[]
  filter?: () => JSX.Element
  customBlocks?: {
    index: number
    component: () => JSX.Element
  }[]
  extraColumns?: ((value?: any) => JSX.Element)[]
  setRecord?: (record: any) => void
  search?: string
}

const Table = ({
  array,
  label = [],
  keysToDisplay = [],
  filter,
  customBlocks = [],
  extraColumns = [],
  setRecord,
  search,
}: TableProps) => {
  const [searchedData, setSearchedData] = useState('')
  const navigate = useNavigate()
  const [noOfRecordsPerPage, setNoOfRecordsPerPage] = useState(10)
  const [currentPage, setCurrentPage] = useState(1)
  const [recordsPerPage, setRecordsPerPage] = useState<any[]>()

  useEffect(() => {
    setRecordsPerPage(
      array &&
        array.filter((obj) => {
          return searchedData === '' || obj[search || ''].toLowerCase().includes(searchedData.toLowerCase())
        }),
    )
  }, [searchedData])

  useEffect(() => {
    const startIndex = (currentPage - 1) * noOfRecordsPerPage
    const endIndex = startIndex + noOfRecordsPerPage

    setRecordsPerPage(array && array.slice(startIndex, endIndex))
  }, [array, noOfRecordsPerPage, currentPage])

  const renderComponent = (index: number, data: any) => {
    const temp = data
      .map((block: any) => {
        return block.index === index ? block : false
      })
      .filter((item: any) => item !== false)[0]

    return temp || false
  }

  return (
    <>
      <div className="flex justify-end">
        {search && <TableSearchBar onChange={(event) => setSearchedData(event.target.value)} />}
        {filter && filter()}
      </div>
      <div className="bg-[white] rounded-[9px]  border border-[#c4c4c4] shadow-lg">
        <table className="w-full">
          <thead className="rounded-tr-[9px] rounded-tl-[9px] ">
            <tr className="uppercase border-b border-[#c4c4c4]">
              {label.map((text, index) => {
                return (
                  <th
                    className={`py-4 bg-[#F9FAFB] font-[600] text-[15px] text-[#1D2939] whitespace-nowrap 
                        ${
                          index === label.length - 1
                            ? 'text-right pr-9 rounded-tr-[9px]'
                            : index == 0
                              ? 'text-left pl-9 rounded-tl-[9px]'
                              : 'text-left pl-9'
                        }
                        `}
                  >
                    {text}
                  </th>
                )
              })}
            </tr>
          </thead>
          <tbody>
            {recordsPerPage ? (
              recordsPerPage.map((obj, mainIndex) => {
                return (
                  <tr
                    onClick={() => {
                      if (setRecord) setRecord(obj)
                      // navigate("/customers/customerdetails")
                    }}
                    className="cursor-pointer hover:bg-[#D0D5DD] border-b border-[#F2F2F2]"
                  >
                    {keysToDisplay.map((key, index) => {
                      const blocksList = renderComponent(index, customBlocks)
                      return (
                        <td
                          className={`py-4 font-[400] text-[14px] text-[#858992] text-left pl-9 whitespace-nowrap ${
                            index === label.length - 1 ? 'text-right pr-9 ' : 'text-left pl-9 '
                          }`}
                        >
                          {blocksList ? blocksList.component(key ? obj[key] : obj) : obj[key]}
                        </td>
                      )
                    })}
                    {extraColumns.map((item: any) => {
                      return (
                        <td
                          className={`py-4 font-[400] text-[14px] text-[#858992] flex justify-end pr-9 whitespace-nowrap`}
                        >
                          {item(obj)}
                        </td>
                      )
                    })}
                  </tr>
                )
              })
            ) : (
              <tr>
                <td colSpan={label.length} className="px-6 py-4">
                  {label.map((item, index) => {
                    return <Skeleton height={50} />
                  })}
                </td>
              </tr>
            )}
          </tbody>
        </table>
        <Pagination
          noOfRecordsPerPage={noOfRecordsPerPage}
          setNoOfRecordsPerPage={setNoOfRecordsPerPage}
          setCurrentPage={setCurrentPage}
          currentPage={currentPage}
          noOfTotalRecords={array?.length || 0}
        />
      </div>
    </>
  )
}
export default Table
