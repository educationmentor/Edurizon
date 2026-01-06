import React from 'react'
import {useState,useMemo} from 'react'
import axios from 'axios';
import { baseUrl } from '@/lib/baseUrl';
import toast, {Toaster} from 'react-hot-toast';
import authHeaders from '@/components/admin/authHeader'

const BillGeneration = ({ fetchFinanceData,  students = [] }: { fetchFinanceData:()=>void ,students?:any[]}) => {
    
    const [billFormOpen,setBillFormOpen] = useState(true);
    const [submittingBill, setSubmittingBill] = useState(false);
    const [billForm, setBillForm] = useState({
        studentId: '',
        studentName: '',
        amountDue: '',
        dueDate: '',
        description: '',
        university: '',
        paymentNumber: '',
      });
    const [studentPickerOpen, setStudentPickerOpen] = useState(false);
    const [studentPickerSearch, setStudentPickerSearch] = useState('');


    const handleBillFormChange = (field:any, value:any) => {
    setBillForm((prev) => ({ ...prev, [field]: value }));
    };


    const handleSelectStudentForBill = (student:any) => {
        setBillForm((prev) => ({
          ...prev,
          studentId: student._id,
          studentName: student.name,
        }));
        setStudentPickerOpen(false);
      };

    const handleCreateBill = async (event:any) => {
    event.preventDefault();
    if (!billForm.studentId || !billForm.amountDue || !billForm.dueDate || !billForm.description || !billForm.university || !billForm.paymentNumber) {
        toast.error('Please complete all required fields');
        return;
    }

    setSubmittingBill(true);
    try {
        const headers = authHeaders();
      
        // Generate payment receipt PDF
        const receiptPayload = {
          studentId: billForm.studentId,
          paymentAmount: Number(billForm.amountDue),
          paymentNumber: billForm.paymentNumber,
          studentName: billForm.studentName,
          university: billForm.university,
          status:'due'
        };

        const res:any= await axios.post(`${baseUrl}/api/admin/finance/bills/generate-receipt`, receiptPayload, { headers })
        // Create bill with receipt URL
        const payload = {
        studentId: billForm.studentId,
        amountDue: Number(billForm.amountDue),
        dueDate: billForm.dueDate,
        description: billForm.description,
        newBill:{status:'due', url:res.data.url , description: billForm.description},
        studentName: billForm.studentName,
        university: billForm.university,
        url:res.data.url
        };

        await axios.post(`${baseUrl}/api/admin/finance/bills`, payload, { headers });
        toast.success('Bill generated successfully');
        setBillForm({
        studentId: '',
        studentName: '',
        amountDue: '',
        dueDate: '',
        description: '',
        university: '',
        paymentNumber: '',
        });
        setStudentPickerSearch('');
        await fetchFinanceData();
    } catch (err: any) {
        console.error('Failed to create bill:', err);
        toast.error(
        err?.response?.data?.message ||
        err?.message ||
        'Failed to create bill'
        );
    } finally {
        setSubmittingBill(false);
    }
    }

    const filteredStudentOptions = useMemo(() => {
        const query = studentPickerSearch.trim().toLowerCase();
    
        // Ensure students is an array before iterating
        const studentsArray = Array.isArray(students) ? students : [];
        const sorted = [...studentsArray].sort((a, b) =>
          (a.name || '').localeCompare(b.name || '', undefined, { sensitivity: 'base' })
        );
    
        if (!query) return sorted;
    
        return sorted.filter(
          (student) =>
            student.name?.toLowerCase().includes(query) || student.email?.toLowerCase().includes(query)
        );
      }, [studentPickerSearch, students]);
  
    return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200">
      <button
        type="button"
        className="w-full flex items-center justify-between px-6 py-4"
        onClick={() => setBillFormOpen(!billFormOpen)}
      >
        <div className='mx-auto'>
          <p className="text-lg font-semibold text-gray-900">Generate New Bill</p>
          <p className="text-sm text-gray-500">
            Create and assign a new bill to a registered student
          </p>
        </div>
        <svg
          className={`w-5 h-5 text-gray-600 transition-transform ${
            billFormOpen ? 'rotate-180' : 'rotate-0'
          }`}
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {billFormOpen && (
        <div className="border-t border-gray-100 px-6 py-6">
          <form onSubmit={handleCreateBill} className="grid grid-cols-1 gap-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Select Student
                </label>
                <div
                  className="border border-gray-200 rounded-lg px-4 py-2 flex items-center justify-between cursor-pointer"
                  onClick={() => setStudentPickerOpen(!studentPickerOpen)}
                >
                  <div>
                    <p className="text-sm text-gray-900">
                      {billForm.studentName || 'Choose a student'}
                    </p>
                    <p className="text-xs text-gray-500">
                      {billForm.studentId ? 'Ready to generate bill' : 'Required field'}
                    </p>
                  </div>
                  <svg
                    className={`w-4 h-4 text-gray-500 transform ${
                      studentPickerOpen ? 'rotate-180' : 'rotate-0'
                    }`}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>

                {studentPickerOpen && (
                  <div className="absolute z-20 mt-2 w-full bg-white border border-gray-100 rounded-xl shadow-lg">
                    <div className="p-3 border-b border-gray-100">
                      <input
                        type="text"
                        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-teal-500"
                        placeholder="Search student..."
                        value={studentPickerSearch}
                        onChange={(e) => setStudentPickerSearch(e.target.value)}
                      />
                    </div>
                    <div className="max-h-48 overflow-y-auto">
                      {filteredStudentOptions.length === 0 && (
                        <p className="text-xs text-center text-gray-500 py-3">No students found</p>
                      )}
                      {filteredStudentOptions.map((student) => (
                        <button
                          type="button"
                          key={student._id}
                          className="w-full px-4 py-2 text-left hover:bg-gray-50"
                          onClick={() => handleSelectStudentForBill(student)}
                        >
                          <p className="text-sm font-medium text-gray-900">{student.name}</p>
                          <p className="text-xs text-gray-500">{student.email}</p>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Amount Due</label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  className="w-full border border-gray-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-teal-500"
                  placeholder="Enter amount"
                  value={billForm.amountDue}
                  onChange={(e) => handleBillFormChange('amountDue', e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
                <input
                  type="date"
                  className="w-full border border-gray-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-teal-500"
                  value={billForm.dueDate}
                  onChange={(e) => handleBillFormChange('dueDate', e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">University</label>
                <input
                  type="text"
                  className="w-full border border-gray-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-teal-500"
                  placeholder="Enter university name"
                  value={billForm.university}
                  onChange={(e) => handleBillFormChange('university', e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Payment Number</label>
                <input
                  type="text"
                  className="w-full border border-gray-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-teal-500"
                  placeholder="Enter payment number"
                  value={billForm.paymentNumber}
                  onChange={(e) => handleBillFormChange('paymentNumber', e.target.value)}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                rows={4}
                className="w-full border border-gray-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-teal-500"
                placeholder="Describe the bill purpose..."
                value={billForm.description}
                onChange={(e) => handleBillFormChange('description', e.target.value)}
              />
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={submittingBill}
                className="inline-flex items-center px-5 py-2 rounded-lg bg-teal-600 text-white text-sm font-semibold hover:bg-teal-700 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {submittingBill ? 'Generating...' : 'Generate Bill'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}


export default BillGeneration
