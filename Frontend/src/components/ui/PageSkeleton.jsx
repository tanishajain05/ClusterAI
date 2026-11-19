import React from 'react'

export default function PageSkeleton() {
  return (
    <div className="p-6 space-y-4 w-full">
      <div className="skeleton h-8 w-48 rounded-lg" />
      <div className="skeleton h-4 w-full rounded" />
      <div className="skeleton h-4 w-5/6 rounded" />
      <div className="skeleton h-4 w-4/6 rounded" />
      <div className="grid grid-cols-3 gap-4 mt-6">
        {[1,2,3].map(i => <div key={i} className="skeleton h-28 rounded-xl" />)}
      </div>
    </div>
  )
}
