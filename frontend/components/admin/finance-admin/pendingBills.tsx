import React from 'react'
import renderStatusBadge from './renderStatusBadge';
import toast from 'react-hot-toast';
const PendingBills = ({ pendingTabRows, openStudentBillsModal, openPaymentModal }: { pendingTabRows: any[], openStudentBillsModal: (student: any) => void, openPaymentModal: (bill: any) => void }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200">
    <div className="px-6 py-4 flex items-center justify-between border-b border-gray-100">
      <div>
        <p className="text-lg font-semibold text-gray-900">Pending Bills & Payments</p>
        <p className="text-sm text-gray-500">Track outstanding dues and follow up with students</p>
      </div>
      <p className="text-sm text-gray-500">Total pending bills: {pendingTabRows.length}</p>
    </div>

    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-100">
        <thead className="bg-gray-50">
          <tr>
            {['Student', 'Description', 'Amount Due', 'Due Date', 'Status', 'Actions'].map((header) => (
              <th
                key={header}
                scope="col"
                className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-100">
          {pendingTabRows.length === 0 && (
            <tr>
              <td colSpan={6} className="px-6 py-8 text-center text-sm text-gray-500">
                All caught up! There are no pending bills right now.
              </td>
            </tr>
          )}
          {pendingTabRows.map((bill) => (
            <tr key={bill._id} className="hover:bg-gray-50 transition-colors">
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                <p className="font-medium">{bill?.studentId?.name || 'Unknown Student'}</p>
                <p className="text-xs text-gray-500">{bill?.studentId?.email || '—'}</p>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 max-w-xs">
                {bill.description}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                ₹{(bill.amountDue || 0).toLocaleString()}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                {bill.dueDate ? new Date(bill.dueDate).toLocaleDateString() : '—'}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">{renderStatusBadge(bill.status)}</td>
              <td className="px-6 py-4 whitespace-nowrap space-x-3">
                <button
                  type="button"
                  className="text-sm font-medium text-teal-600 hover:text-teal-800"
                  onClick={() =>
                    bill?.studentId ? openStudentBillsModal(bill.studentId) : toast.error('Student record missing')
                  }
                >
                  View Bills
                </button>
                <button
                  type="button"
                  className="text-sm font-medium text-teal-600 hover:text-teal-800"
                  onClick={() => openPaymentModal(bill)}
                >
                  Record Payment
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
  )
}

export default PendingBills
