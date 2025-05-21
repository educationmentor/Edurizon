import Layout from '@/components/admin/CounsellorLayout';
import { useState } from 'react';
import { FaBell } from 'react-icons/fa';
import { FiSearch } from 'react-icons/fi';
import { Button } from '@/components/ui/button';
import {
  LineChart
} from '@mui/x-charts';

const Dashboard = () => {
  const [tab, setTab] = useState('Completed');

  const students = Array(8).fill({
    name: 'student_1',
    country: 'Russia',
    contact: '1234567892',
    date: '16 Jan 2025',
    course: 'Medical Science',
    response: 'Positive',
  });

  const experienceData = [
    { week: 'Week 1', rating: 4.2 },
    { week: 'Week 2', rating: 4.5 },
    { week: 'Week 3', rating: 4.6 },
    { week: 'Week 4', rating: 4.7 },
  ];

  const completionData = [
    { date: 'Aug 01', sessions: 6 },
    { date: 'Aug 10', sessions: 5 },
    { date: 'Aug 20', sessions: 5 },
    { date: 'Aug 31', sessions: 6 },
  ];

   const xData = [1, 2, 3, 5, 8, 10];
  const yData = [2, -5.5, 2, -7.5, 1.5, 6];

  return (
     <Layout>
    <div className="min-h-screen bg-white text-gray-900 flex">
      {/* Sidebar */}
     

      {/* Main Content */}
      <main className="flex-1 p-6 space-y-6 overflow-auto">
        <div className="flex justify-between items-center">
          <h1 className="text-xl font-bold">Hello User</h1>
          <div className="flex items-center space-x-4">
            <FaBell className="text-gray-600" />
            <div className="relative">
              <input type="text" placeholder="Search here" className="border px-4 py-2 rounded" />
              <FiSearch className="absolute right-3 top-3 text-gray-400" />
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div className="border p-4 rounded shadow">
            <div className="text-gray-500">Overall Counseling Experience</div>
            <div className="text-2xl font-bold mt-2">4.6 ⭐⭐⭐⭐☆</div>
            <div className="h-40 mt-4">
      <LineChart xAxis={[{ data: [1, 2, 3, 5, 8, 10] }]} series={[ {data: [2, -5.5, 2, -7.5, 1.5, 6],
        area: true, baseline: 'min', showMark: false, color: '#FFFFFF', },// Area color
        { data: [2, -5.5, 2, -7.5, 1.5, 6], area: false, showMark: false, color: '#000000', },]}// Line color
        height={300}/>

            </div>
          </div>

          {/* <div className="border p-4 rounded shadow">
            <div className="text-gray-500">Counseling Completed</div>
            <div className="h-40 mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={completionData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="sessions" stroke="#0d9488" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div> */}
        </div>

        <div>
          <div className="flex justify-between items-center">
            <div className="space-x-4">
              {['Completed', 'Pending', 'Upcoming'].map((item) => (
                <button
                  key={item}
                  onClick={() => setTab(item)}
                  className={`px-4 py-2 rounded-t ${tab === item ? 'bg-green-600 text-white' : 'bg-gray-200'}`}
                >
                  {item}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline">Filter</Button>
              <Button>Add Session</Button>
            </div>
          </div>

          <div className="overflow-x-auto mt-4">
            <table className="min-w-full border rounded">
              <thead className="bg-green-600 text-white">
                <tr>
                  <th className="p-2">Student name</th>
                  <th className="p-2">Country</th>
                  <th className="p-2">Contact No.</th>
                  <th className="p-2">Session Scheduled Date</th>
                  <th className="p-2">Course name</th>
                  <th className="p-2">Response</th>
                  <th className="p-2">Message</th>
                </tr>
              </thead>
              <tbody>
                {students.map((student, idx) => (
                  <tr key={idx} className="text-center border-b">
                    <td className="p-2 flex items-center gap-2">
                      <img src="https://via.placeholder.com/30" className="rounded-full" />
                      {student.name}
                    </td>
                    <td className="p-2">{student.country}</td>
                    <td className="p-2">{student.contact}</td>
                    <td className="p-2">{student.date}</td>
                    <td className="p-2">{student.course}</td>
                    <td className="p-2">{student.response}</td>
                    <td className="p-2">
                      <Button variant="outline" size="sm">message</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex justify-end space-x-2 mt-4">
            <Button variant="outline">1</Button>
            <Button variant="outline">2</Button>
            <Button variant="outline">3</Button>
          </div>
        </div>
      </main>
    </div>
      </Layout>

  );
};

export default Dashboard;