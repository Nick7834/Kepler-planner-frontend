import React from 'react'
import { AllTaskDay } from '@/app/components/display/AllTaskDay/AllTaskDay'
import { TaskDetail } from '@/app/components/display/TaskDetail/TaskDetail'
import { AllTasksPage } from '@/app/components/display/AllTasksPage/AllTasksPage'

export default function page() {
  return (
    <div className='flex items-center justify-center gap-[50px]'>

        <AllTasksPage />
       
    </div>
  )
}
