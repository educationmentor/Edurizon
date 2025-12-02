import React, { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import DocumentLayout from '@/components/admin/DocumentLayout';
import { baseUrl } from '@/lib/baseUrl';
import { getAdminToken } from '@/utils/adminStorage';
import GridViewIcon from '@mui/icons-material/GridView';

const navItems = [
  {
    href: '/admin/finance',
    icon: <GridViewIcon />,
    label: 'Overview',
  },
];

const FinanceDashboard = () => {
  const [activeTab, setActiveTab] = useState('students');
  const [topSearchTerm, setTopSearchTerm] = useState('');
  const [students, setStudents] = useState([]);
  const [allBills, setAllBills] = useState([]);
  const [pendingBills, setPendingBills] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [billFormOpen, setBillFormOpen] = useState(true);
  const [billForm, setBillForm] = useState({
    studentId: '',
    studentName: '',
    amountDue: '',
    dueDate: '',
    description: '',
  });
  const [studentPickerOpen, setStudentPickerOpen] = useState(false);
  const [studentPickerSearch, setStudentPickerSearch] = useState('');
  const [submittingBill, setSubmittingBill] = useState(false);

  const [studentModal, setStudentModal] = useState({
    open: false,
    student: null,
    bills: [],
    loading: false,
  });

  const [paymentModal, setPaymentModal] = useState({
    open: false,
    bill: null,
    amount: '',
    method: '',
    loading: false,
  });

  const authHeaders = () => {
    const token = getAdminToken();
    if (!token) return {};
    const formatted = token.startsWith('Bearer ') ? token : `Bearer ${token}`;
    return { Authorization: formatted };
  };

  const fetchFinanceData = async () => {
    setLoading(true);
    setError('');
    try {
      const headers = authHeaders();
      const [studentsRes, billsRes, pendingRes] = await Promise.all([
        axios.get(`${baseUrl}/api/admin/finance/students/all`, { headers }),
        axios.get(`${baseUrl}/api/admin/finance/bills/all`, { headers }),
        axios.get(`${baseUrl}/api/admin/finance/bills/pending`, { headers }),
      ]);

      setStudents(studentsRes.data?.data || []);
      setAllBills(billsRes.data?.data || []);
      setPendingBills(pendingRes.data?.data || []);
    } catch (err) {
      console.error('Failed to load finance dashboard:', err);
      const message = err?.response?.data?.message || 'Failed to load finance data';
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFinanceData();
  }, []);

  const studentFinancialMap = useMemo(() => {
    const map = new Map();
    allBills.forEach((bill) => {
      const key =
        bill?.studentId?._id || bill?.studentId || bill?.student?._id || String(bill?.studentId);
      if (!key) return;

      if (!map.has(key)) {
        map.set(key, {
          totalBilled: 0,
          totalPaid: 0,
          outstanding: 0,
          status: 'Pending',
        });
      }

      const entry = map.get(key);
      entry.totalBilled += bill.amountDue || 0;
      entry.totalPaid += bill.amountPaid || 0;
      entry.outstanding = Math.max(entry.totalBilled - entry.totalPaid, 0);

      if (bill.status === 'Overdue') {
        entry.status = 'Overdue';
      } else if (bill.status === 'Partial Payment' && entry.status !== 'Overdue') {
        entry.status = 'Partial Payment';
      } else if (
        bill.status === 'Paid' &&
        entry.status !== 'Overdue' &&
        entry.status !== 'Partial Payment'
      ) {
        entry.status = 'Paid';
      } else if (entry.outstanding === 0) {
        entry.status = 'Paid';
      }
    });
    return map;
  }, [allBills]);

  const summaryStats = useMemo(() => {
    const totalOutstanding = pendingBills.reduce((sum, bill) => {
      const outstanding = Math.max((bill.amountDue || 0) - (bill.amountPaid || 0), 0);
      return sum + outstanding;
    }, 0);

    const totalPaid = allBills.reduce((sum, bill) => sum + (bill.amountPaid || 0), 0);
    const totalBilled = allBills.reduce((sum, bill) => sum + (bill.amountDue || 0), 0);

    return {
      totalStudents: students.length,
      totalOutstanding,
      totalPaid,
      totalBilled,
    };
  }, [students.length, pendingBills, allBills]);

  const filteredStudentOptions = useMemo(() => {
    const query = studentPickerSearch.trim().toLowerCase();
    if (!query) return students;
    return students.filter(
      (student) =>
        student.name?.toLowerCase().includes(query) || student.email?.toLowerCase().includes(query)
    );
  }, [studentPickerSearch, students]);

  const enrichedStudents = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return students
      .map((student) => {
        const summary =
          studentFinancialMap.get(student._id) || {
            totalBilled: 0,
            totalPaid: 0,
            outstanding: 0,
            status: 'Pending',
          };
        const overallStatus =
          summary.outstanding <= 0
            ? 'Paid'
            : summary.status === 'Overdue'
            ? 'Overdue'
            : summary.status === 'Partial Payment'
            ? 'Partial Payment'
            : 'Pending';

        return {
          ...student,
          totalBilled: summary.totalBilled,
          totalPaid: summary.totalPaid,
          outstanding: summary.outstanding,
          overallStatus,
        };
      })
      .filter((student) => {
        if (!query) return true;
        return (
          student.name?.toLowerCase().includes(query) ||
          student.email?.toLowerCase().includes(query) ||
          student.overallStatus?.toLowerCase().includes(query)
        );
      });
  }, [students, studentFinancialMap, searchQuery]);

  const pendingTabRows = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return pendingBills.filter((bill) => {
      const studentName = bill?.studentId?.name?.toLowerCase() || '';
      const description = bill.description?.toLowerCase() || '';
      return (
        !query ||
        studentName.includes(query) ||
        description.includes(query) ||
        bill.status?.toLowerCase().includes(query)
      );
    });
  }, [pendingBills, searchQuery]);

  const handleBillFormChange = (field, value) => {
    setBillForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSelectStudentForBill = (student) => {
    setBillForm((prev) => ({
      ...prev,
      studentId: student._id,
      studentName: student.name,
    }));
    setStudentPickerOpen(false);
  };

  const handleCreateBill = async (event) => {
    event.preventDefault();
    if (!billForm.studentId || !billForm.amountDue || !billForm.dueDate || !billForm.description) {
      toast.error('Please complete all required fields');
      return;
    }

    setSubmittingBill(true);
    try {
      const headers = authHeaders();
      const payload = {
        studentId: billForm.studentId,
        amountDue: Number(billForm.amountDue),
        dueDate: billForm.dueDate,
        description: billForm.description,
      };

      await axios.post(`${baseUrl}/api/admin/finance/bills`, payload, { headers });
      toast.success('Bill generated successfully');
      setBillForm({
        studentId: '',
        studentName: '',
        amountDue: '',
        dueDate: '',
        description: '',
      });
      setStudentPickerSearch('');
      await fetchFinanceData();
    } catch (err) {
      console.error('Failed to create bill:', err);
      toast.error(err?.response?.data?.message || 'Failed to create bill');
    } finally {
      setSubmittingBill(false);
    }
  };

  const openStudentBillsModal = async (student) => {
    setStudentModal({
      open: true,
      student,
      bills: [],
      loading: true,
    });

    try {
      const headers = authHeaders();
      const res = await axios.get(
        `${baseUrl}/api/admin/finance/bills/student/${student._id}`,
        {
          headers,
        }
      );
      setStudentModal((prev) => ({
        ...prev,
        bills: res.data?.data || [],
        loading: false,
      }));
    } catch (err) {
      console.error('Failed to fetch student bills:', err);
      toast.error(err?.response?.data?.message || 'Failed to load student bills');
      setStudentModal((prev) => ({ ...prev, loading: false }));
    }
  };

  const closeStudentModal = () => {
    setStudentModal({
      open: false,
      student: null,
      bills: [],
      loading: false,
    });
  };

  const openPaymentModal = (bill) => {
    setPaymentModal({
      open: true,
      bill,
      amount: '',
      method: '',
      loading: false,
    });
  };

  const closePaymentModal = () => {
    setPaymentModal({
      open: false,
      bill: null,
      amount: '',
      method: '',
      loading: false,
    });
  };

  const handleSubmitPayment = async (event) => {
    event.preventDefault();
    if (!paymentModal.bill?._id || !paymentModal.amount) {
      toast.error('Please enter the payment amount');
      return;
    }

    setPaymentModal((prev) => ({ ...prev, loading: true }));
    try {
      const headers = authHeaders();
      const payload = {
        amount: Number(paymentModal.amount),
        method: paymentModal.method || 'Manual',
      };
      await axios.patch(
        `${baseUrl}/api/admin/finance/bills/${paymentModal.bill._id}/payment`,
        payload,
        { headers }
      );
      toast.success('Payment recorded');
      closePaymentModal();
      await fetchFinanceData();
      if (studentModal.open && studentModal.student) {
        openStudentBillsModal(studentModal.student);
      }
    } catch (err) {
      console.error('Failed to record payment:', err);
      toast.error(err?.response?.data?.message || 'Failed to record payment');
      setPaymentModal((prev) => ({ ...prev, loading: false }));
    }
  };

  const renderStatusBadge = (status) => {
    const colors = {
      Paid: 'bg-green-100 text-green-700',
      Pending: 'bg-yellow-100 text-yellow-700',
      'Partial Payment': 'bg-blue-100 text-blue-700',
      Overdue: 'bg-red-100 text-red-600',
      Cancelled: 'bg-gray-100 text-gray-600',
    };
    const color = colors[status] || 'bg-gray-100 text-gray-600';
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium ${color}`}>{status}</span>
    );
  };

  const renderBillGenerationSection = () => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200">
      <button
        type="button"
        className="w-full flex items-center justify-between px-6 py-4"
        onClick={() => setBillFormOpen((prev) => !prev)}
      >
        <div>
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
                  onClick={() => setStudentPickerOpen((prev) => !prev)}
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
  );

  const renderStudentTrackingTable = () => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200">
      <div className="px-6 py-4 flex items-center justify-between border-b border-gray-100">
        <div>
          <p className="text-lg font-semibold text-gray-900">Student Tracking</p>
          <p className="text-sm text-gray-500">Monitor billing status across all registered students</p>
        </div>
        <p className="text-sm text-gray-500">
          Showing {enrichedStudents.length} of {students.length} students
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-100">
          <thead className="bg-gray-50">
            <tr>
              {['Student', 'Email', 'Total Billed', 'Total Paid', 'Outstanding', 'Status', 'Actions'].map(
                (header) => (
                  <th
                    key={header}
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider"
                  >
                    {header}
                  </th>
                )
              )}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {enrichedStudents.length === 0 && (
              <tr>
                <td colSpan={7} className="px-6 py-8 text-center text-sm text-gray-500">
                  No students found. Adjust your search or try again later.
                </td>
              </tr>
            )}
            {enrichedStudents.map((student) => (
              <tr key={student._id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <p className="font-medium text-gray-900">{student.name}</p>
                    <p className="text-xs text-gray-500">{student.phone || '—'}</p>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                  {student.email}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                  ₹{student.totalBilled.toLocaleString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-teal-700 font-semibold">
                  ₹{student.totalPaid.toLocaleString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-semibold">
                  ₹{student.outstanding.toLocaleString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">{renderStatusBadge(student.overallStatus)}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <button
                    type="button"
                    className="text-sm font-medium text-teal-600 hover:text-teal-800"
                    onClick={() => openStudentBillsModal(student)}
                  >
                    View Bills
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderPendingBillsTable = () => (
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
  );

  const renderTabs = () => (
    <div className="flex flex-wrap gap-3">
      {[
        { key: 'students', label: 'Bill Generation & Students' },
        { key: 'pending', label: 'Pending Bills / Payments' },
      ].map((tab) => {
        const isActive = activeTab === tab.key;
        return (
          <button
            key={tab.key}
            type="button"
            onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
              isActive
                ? 'bg-teal-600 text-white shadow'
                : 'bg-white text-gray-600 border border-gray-200 hover:border-teal-400'
            }`}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );

  const renderSummaryCards = () => (
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
  );

  return (
    <DocumentLayout navItems={navItems} searchTerm={topSearchTerm} setSearchTerm={setTopSearchTerm}>
      <div className="min-h-screen bg-[#F5F7FA] px-6 py-8">
        <Toaster position="top-right" />
        <div className="flex flex-col gap-6">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 px-6 py-5 flex flex-col gap-4">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <p className="text-2xl font-bold text-gray-900">Finance Administration Dashboard</p>
                <p className="text-sm text-gray-500">
                  Monitor billing health, generate invoices, and follow up on dues.
                </p>
              </div>
              <div className="flex items-center gap-3">
                <div className="relative">
                  <svg
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z"
                    />
                  </svg>
                  <input
                    type="text"
                    placeholder="Search students or bills..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 pr-4 py-2 rounded-full border border-gray-200 focus:ring-teal-500 focus:border-teal-500 text-sm bg-gray-50"
                  />
                </div>
              </div>
            </div>
            {renderTabs()}
          </div>

          {renderSummaryCards()}

          {error && (
            <div className="bg-red-50 border border-red-100 text-red-700 px-4 py-3 rounded-xl">
              {error}
            </div>
          )}

          {loading ? (
            <div className="bg-white rounded-xl border border-gray-100 p-10 text-center text-gray-500">
              Loading finance data...
            </div>
          ) : (
            <>
              {activeTab === 'students' && (
                <div className="flex flex-col gap-6">
                  {renderBillGenerationSection()}
                  {renderStudentTrackingTable()}
                </div>
              )}
              {activeTab === 'pending' && renderPendingBillsTable()}
            </>
          )}
        </div>
      </div>

      {studentModal.open && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-4xl w-full max-h-[80vh] overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <div>
                <p className="text-lg font-semibold text-gray-900">
                  {studentModal.student?.name || 'Student'}
                </p>
                <p className="text-sm text-gray-500">{studentModal.student?.email}</p>
              </div>
              <button
                type="button"
                className="text-gray-400 hover:text-gray-600"
                onClick={closeStudentModal}
              >
                ✕
              </button>
            </div>

            <div className="px-6 py-4 overflow-y-auto max-h-[65vh]">
              {studentModal.loading ? (
                <p className="text-center text-sm text-gray-500 py-6">Loading bills...</p>
              ) : studentModal.bills.length === 0 ? (
                <p className="text-center text-sm text-gray-500 py-6">
                  No bills available for this student.
                </p>
              ) : (
                <table className="min-w-full divide-y divide-gray-100">
                  <thead className="bg-gray-50">
                    <tr>
                      {['Description', 'Amount Due', 'Amount Paid', 'Due Date', 'Status', 'Actions'].map(
                        (header) => (
                          <th
                            key={header}
                            className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider"
                          >
                            {header}
                          </th>
                        )
                      )}
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-100">
                    {studentModal.bills.map((bill) => (
                      <tr key={bill._id}>
                        <td className="px-4 py-3 text-sm text-gray-900">{bill.description}</td>
                        <td className="px-4 py-3 text-sm font-semibold text-gray-900">
                          ₹{(bill.amountDue || 0).toLocaleString()}
                        </td>
                        <td className="px-4 py-3 text-sm text-teal-700 font-semibold">
                          ₹{(bill.amountPaid || 0).toLocaleString()}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600">
                          {bill.dueDate ? new Date(bill.dueDate).toLocaleDateString() : '—'}
                        </td>
                        <td className="px-4 py-3">{renderStatusBadge(bill.status)}</td>
                        <td className="px-4 py-3">
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
              )}
            </div>
          </div>
        </div>
      )}

      {paymentModal.open && (
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
                    setPaymentModal((prev) => ({ ...prev, amount: e.target.value }))
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
                    setPaymentModal((prev) => ({ ...prev, method: e.target.value }))
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
      )}
    </DocumentLayout>
  );
};

export default FinanceDashboard;


