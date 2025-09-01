// import { useEffect, useState } from 'react'
// import { GetAllCategories, GetPackagesByCategory } from '../../../apis/services/services.api'
// import Loading from '../../shared/Loading/Loading'
// import Tabs from '../../shared/Tabs/Tabs'
import { useEffect } from 'react'
import HourlyRecording from './Hourly-Recording/HourlyRecording'
import { tracking } from '../../../GTM/gtm'

export default function SelectPackage() {
  useEffect(() => {
    tracking("view_content")
  }, [])
  // const { data: categories, isLoading } = GetAllCategories()
  // const { mutate: getPackages, isLoading: packagesLoading, data } = GetPackagesByCategory()
  // const categoryId = JSON.parse(localStorage.getItem("bookingData"))?.selectedPackage?.category
  // const [activeTab, setActiveTab] = useState(categoryId || null)

  // const handelChange = (id) => {
  //   setActiveTab(id)
  //   getPackages({ category: id })
  // }

  // useEffect(() => {
  //   getPackages({ category: activeTab  })
  // }, [activeTab])

  // if (isLoading) return <Loading />

  return (
    <>
      {/* <Tabs
        tabs={categories?.data?.map((category) => ({
          id: category._id,
          label: category.name
        }))}
        activeTabId={activeTab}
        onTabChange={(id) => handelChange(id)}
      /> */}

      {/* {packagesLoading && <Loading />} */}
      {/* <HourlyRecording packages={data?.data} /> */}
      <HourlyRecording />
    </>
  )
}
