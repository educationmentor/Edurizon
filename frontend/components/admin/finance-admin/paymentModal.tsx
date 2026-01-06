import React from 'react'

const PaymentModal = ({ paymentModal, closePaymentModal, handleSubmitPayment, setPaymentModal }: { paymentModal: any, closePaymentModal: () => void, handleSubmitPayment: (e: React.FormEvent<HTMLFormElement>) => void, setPaymentModal: (prev: any) => void }) => {
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <div>
                <p className="text-lg font-semibold text-gray-900">Record Payment</p>
                <p className="text-sm text-gray-500">
                  {paymentModal.bill?.description || 'Bill reference'}
                </p>
              </div>
              <button
                type="button"
                className="text-gray-400 hover:text-gray-600"
                onClick={closePaymentModal}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmitPayment} className="px-6 py-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Amount</label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  className="w-full border border-gray-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-teal-500"
                  placeholder="Enter payment amount"
                  value={paymentModal.amount}
                  onChange={(e) =>
                    setPaymentModal((prev: any) => ({ ...prev, amount: e.target.value }))
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Method</label>
                <input
                  type="text"
                  className="w-full border border-gray-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-teal-500"
                  placeholder="Bank transfer, credit card..."
                  value={paymentModal.method}
                  onChange={(e) =>
                    setPaymentModal((prev: any) => ({ ...prev, method: e.target.value }))
                  }
                />
              </div>
              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  disabled={paymentModal.loading}
                  className="inline-flex items-center px-5 py-2 rounded-lg bg-teal-600 text-white text-sm font-semibold hover:bg-teal-700 disabled:opacity-60"
                >
                  {paymentModal.loading ? 'Saving...' : 'Record Payment'}
                </button>
              </div>
            </form>
          </div>
        </div>
  )
}

export default PaymentModal
