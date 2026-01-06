import React from 'react'

const SummaryCards = ({ summaryStats }: { summaryStats: any }) => {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {[
        {
          label: 'Total Students',
          value: summaryStats.totalStudents.toLocaleString(),
          subtext: 'Active finance profiles',
        },
        {
          label: 'Total Amount Billed',
          value: `₹${summaryStats.totalBilled.toLocaleString()}`,
          subtext: 'All-time',
        },
        {
          label: 'Total Amount Paid',
          value: `₹${summaryStats.totalPaid.toLocaleString()}`,
          subtext: 'Across all bills',
        },
        {
          label: 'Outstanding Amount',
          value: `₹${summaryStats.totalOutstanding.toLocaleString()}`,
          subtext: 'Pending & overdue',
        },
      ].map((card) => (
        <div key={card.label} className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
          <p className="text-sm text-gray-500">{card.label}</p>
          <p className="text-2xl font-semibold text-gray-900 mt-2">{card.value}</p>
          <p className="text-xs text-gray-400 mt-1">{card.subtext}</p>
        </div>
      ))}
    </div>
  )
}

export default SummaryCards
