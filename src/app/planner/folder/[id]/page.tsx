'use client'

import { FolderPage } from '@/app/components/display/FolderPage/FolderPage';
import React from 'react';

export default function page({ params }: { params: { id: string } }) {

  return (
    <div>
      <FolderPage idFolder={params.id} />
    </div>
  )
}
