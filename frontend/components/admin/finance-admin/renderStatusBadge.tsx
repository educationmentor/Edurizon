const renderStatusBadge = (status: string) => {
    const colors = {
      Paid: 'bg-green-100 text-green-700',
      Pending: 'bg-yellow-100 text-yellow-700',
      'Partial Payment': 'bg-blue-100 text-blue-700',
      Overdue: 'bg-red-100 text-red-600',
      Cancelled: 'bg-gray-100 text-gray-600',
    };
    const color = colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-600';
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium ${color}`}>{status}</span>
    );
  };
export default renderStatusBadge;