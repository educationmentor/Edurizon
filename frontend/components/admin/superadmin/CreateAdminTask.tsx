import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { baseUrl } from '@/lib/baseUrl';
import { getAdminData, getAdminToken } from '@/utils/adminStorage';

interface AdminUser {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
}

interface Reply {
  senderId: AdminUser & { role?: string };
  replyMessage: string;
  timestamp: string;
}

interface AssignedAdmin {
  adminId: AdminUser;
  isRead: boolean;
  isDeleted: boolean;
}

interface AdminTask {
  _id: string;
  messageDetail: string;
  taskType?: 'Task' | 'Update';
  deadline: string;
  assignedTo: AssignedAdmin[];
  replies: Reply[];
  status: 'Pending' | 'Completed' | 'Overdue';
  senderHasNewReply?: boolean;
}

const CreateAdminTask: React.FC = () => {
  const [admins, setAdmins] = useState<AdminUser[]>([]);
  const [selectedAdminIds, setSelectedAdminIds] = useState<string[]>([]);
  const [messageDetail, setMessageDetail] = useState('');
  const [taskType, setTaskType] = useState<'Task' | 'Update'>('Task');
  const [deadline, setDeadline] = useState('');
  const [loadingAdmins, setLoadingAdmins] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [tasks, setTasks] = useState<AdminTask[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [selectedTask, setSelectedTask] = useState<AdminTask | null>(null);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [modalReply, setModalReply] = useState('');
  const [modalReplyLoading, setModalReplyLoading] = useState(false);
  const [currentAdminId, setCurrentAdminId] = useState<string | null>(null);
  const [activeHistoryTab, setActiveHistoryTab] = useState<'Task' | 'Update'>('Task');

  useEffect(() => {
    const storedAdmin = getAdminData<AdminUser>();
    if (storedAdmin?._id) {
      setCurrentAdminId(storedAdmin._id);
    } else {
      setCurrentAdminId(null);
    }
    fetchSentTasks();
  }, []);

  useEffect(() => {
    fetchAdmins();
  }, [currentAdminId]);

  const fetchAdmins = async () => {
    try {
      setLoadingAdmins(true);
      const token = getAdminToken();
      if (!token) return;

      const authToken = token.startsWith('Bearer ') ? token : `Bearer ${token}`;
      const response = await axios.get(`${baseUrl}/api/admin/users`, {
        headers: {
          Authorization: authToken,
        },
      });

      if (response.data.status === 'success') {
        const filtered = response.data.data
          .filter((user: AdminUser) => user._id !== currentAdminId)
          .sort((a: AdminUser, b: AdminUser) => {
            const nameA = `${a.firstName || ''} ${a.lastName || ''}`.trim().toLowerCase();
            const nameB = `${b.firstName || ''} ${b.lastName || ''}`.trim().toLowerCase();
            if (nameA && nameB) return nameA.localeCompare(nameB);
            return (a.email || '').toLowerCase().localeCompare((b.email || '').toLowerCase());
          });
        setAdmins(filtered);
      }
    } catch (err: any) {
      console.error('Failed to fetch admins:', err);
      setError(err.response?.data?.message || 'Failed to fetch admin users.');
    } finally {
      setLoadingAdmins(false);
    }
  };

  const fetchSentTasks = async () => {
    try {
      setHistoryLoading(true);
      const token = getAdminToken();
      if (!token) return;

      const authToken = token.startsWith('Bearer ') ? token : `Bearer ${token}`;
      const response = await axios.get(`${baseUrl}/api/admin/tasks/sent`, {
        headers: {
          Authorization: authToken,
        },
      });

      const fetchedTasks: AdminTask[] = response.data || [];
      setTasks(fetchedTasks);
      setSelectedTask((prev) => {
        if (!prev) return prev;
        const updated = fetchedTasks.find((task) => task._id === prev._id);
        return updated || prev;
      });
    } catch (err: any) {
      console.error('Failed to fetch sent tasks:', err);
      setError(err.response?.data?.message || 'Failed to fetch sent tasks.');
    } finally {
      setHistoryLoading(false);
    }
  };

  const handleAdminToggle = (id: string) => {
    setSelectedAdminIds((prev) =>
      prev.includes(id) ? prev.filter((adminId) => adminId !== id) : [...prev, id]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!messageDetail.trim() || selectedAdminIds.length === 0) {
      setError('Message and at least one recipient are required.');
      return;
    }

    if (taskType === 'Task' && !deadline) {
      setError('Deadline is required for Task type.');
      return;
    }

    try {
      setSubmitting(true);
      const token = getAdminToken();
      if (!token) {
        setError('Not authenticated as admin.');
        return;
      }
      const authToken = token.startsWith('Bearer ') ? token : `Bearer ${token}`;

      await axios.post(
        `${baseUrl}/api/admin/tasks`,
        {
          messageDetail,
          taskType,
          // Only send deadline if present (for Tasks)
          ...(deadline ? { deadline } : {}),
          recipientAdminIds: selectedAdminIds,
        },
        {
          headers: {
            Authorization: authToken,
          },
        }
      );

      setSuccess('Task/Update created successfully.');
      setMessageDetail('');
      setTaskType('Task');
      setDeadline('');
      setSelectedAdminIds([]);
      fetchSentTasks();
    } catch (err: any) {
      console.error('Failed to create task:', err);
      setError(err.response?.data?.message || 'Failed to create task.');
    } finally {
      setSubmitting(false);
    }
  };

  const formatDeadline = (iso: string) => {
    if (!iso) return 'N/A';
    const d = new Date(iso);
    return d.toLocaleDateString();
  };

  const getRecipientsDisplay = (task: AdminTask) => {
    const names = task.assignedTo
      .map((entry) => {
        const user = entry.adminId;
        if (!user) return null;
        return `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.email;
      })
      .filter(Boolean);
    if (names.length === 0) return '0 recipients';
    if (names.length <= 2) return names.join(', ');
    return `${names.slice(0, 2).join(', ')} +${names.length - 2} more`;
  };

  const getMessageSnippet = (message: string) => {
    if (!message) return '';
    return message.length > 80 ? `${message.slice(0, 77)}...` : message;
  };

  const clearReplyNotification = async (taskId: string) => {
    try {
      const token = getAdminToken();
      if (!token) return;
      const authToken = token.startsWith('Bearer ') ? token : `Bearer ${token}`;
      await axios.patch(
        `${baseUrl}/api/admin/tasks/${taskId}/clear-reply-notification`,
        {},
        { headers: { Authorization: authToken } }
      );
    } catch (err) {
      console.error('Failed to clear reply notification:', err);
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    if (!window.confirm('Delete this task for all recipients?')) return;
    try {
      const token = getAdminToken();
      if (!token) return;
      const authToken = token.startsWith('Bearer ') ? token : `Bearer ${token}`;
      await axios.patch(
        `${baseUrl}/api/admin/tasks/delete/${taskId}`,
        {},
        { headers: { Authorization: authToken } }
      );
      fetchSentTasks();
    } catch (err: any) {
      console.error('Failed to delete task:', err);
      setError(err.response?.data?.message || 'Failed to delete task.');
    }
  };

  const openTaskModal = async (task: AdminTask) => {
    setSelectedTask(task);
    setIsTaskModalOpen(true);
    setModalReply('');

    if (task.senderHasNewReply) {
      await clearReplyNotification(task._id);
      fetchSentTasks();
    }
  };

  const closeTaskModal = () => {
    setIsTaskModalOpen(false);
    setSelectedTask(null);
    setModalReply('');
  };

  const handleModalReplySubmit = async () => {
    if (!selectedTask || !modalReply.trim()) return;
    try {
      setModalReplyLoading(true);
      const token = getAdminToken();
      if (!token) return;
      const authToken = token.startsWith('Bearer ') ? token : `Bearer ${token}`;
      await axios.post(
        `${baseUrl}/api/admin/tasks/reply/${selectedTask._id}`,
        { replyMessage: modalReply },
        { headers: { Authorization: authToken } }
      );
      setModalReply('');
      await fetchSentTasks();
    } catch (err) {
      console.error('Failed to send reply:', err);
    } finally {
      setModalReplyLoading(false);
    }
  };

  const getRecipientStatus = (recipient: AssignedAdmin) => {
    if (recipient.isDeleted) return 'Removed';
    return recipient.isRead ? 'Read' : 'Unread';
  };

  const getReplyAuthor = (reply: Reply) => {
      if (!reply.senderId) return 'Unknown';
      const { firstName, lastName, email, role } = reply.senderId;
      const name = `${firstName || ''} ${lastName || ''}`.trim() || email || 'Unknown';
      return role ? `${name} (${role})` : name;
  };

  return (
    <div className="space-y-8">
      {/* Create Task Form */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex flex-col gap-4">
          {error && (
            <div className="text-sm text-red-600 bg-red-50 p-3 rounded-md">{error}</div>
          )}
          {success && (
            <div className="text-sm text-green-700 bg-green-50 p-3 rounded-md">{success}</div>
          )}

          <div className="grid lg:grid-cols-[3fr,2fr] gap-6">
            {/* Left Column */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Type selector */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-1">
                    Type
                  </label>
                  <div className="flex items-center gap-4">
                    <label className="inline-flex items-center gap-2 text-sm text-gray-700">
                      <input
                        type="radio"
                        name="taskType"
                        value="Task"
                        checked={taskType === 'Task'}
                        onChange={() => setTaskType('Task')}
                        className="h-4 w-4 text-teal-600 border-gray-300 focus:ring-teal-500"
                      />
                      <span>Task</span>
                    </label>
                    <label className="inline-flex items-center gap-2 text-sm text-gray-700">
                      <input
                        type="radio"
                        name="taskType"
                        value="Update"
                        checked={taskType === 'Update'}
                        onChange={() => setTaskType('Update')}
                        className="h-4 w-4 text-teal-600 border-gray-300 focus:ring-teal-500"
                      />
                      <span>Update</span>
                    </label>
                  </div>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-sm font-semibold text-gray-900">
                    Message Detail
                  </label>
                  <span className="text-xs text-gray-400">Max 2000 characters</span>
                </div>
                <div className="bg-white rounded-2xl border border-gray-200 shadow-inner px-4 py-3">
                  <textarea
                    value={messageDetail}
                    onChange={(e) => setMessageDetail(e.target.value)}
                    rows={6}
                    className="block w-full border-none outline-none focus:ring-0 text-sm text-gray-900"
                    placeholder="Write the announcement, task details, or update for your admin team..."
                  />
                </div>
              </div>

              {taskType === 'Task' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-1">
                      Deadline
                    </label>
                    <div className="bg-white rounded-2xl border border-gray-200 shadow-inner px-3 py-2">
                      <input
                        type="date"
                        value={deadline}
                        onChange={(e) => setDeadline(e.target.value)}
                        className="block w-full border-none outline-none focus:ring-0 bg-transparent text-sm text-gray-900"
                      />
                    </div>
                  </div>
                </div>
              )}

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex items-center px-5 py-2.5 border border-transparent text-sm font-semibold rounded-full shadow-sm text-white bg-teal-600 hover:bg-teal-700 disabled:opacity-60 transition"
                >
                  {submitting ? 'Creating...' : 'Create Task / Update'}
                </button>
              </div>
            </form>

            {/* Right Column */}
            <div className="border border-gray-100 rounded-2xl bg-gray-50 h-full flex flex-col">
              <div className="px-4 py-3 border-b border-gray-200 flex items-center justify-between">
                <div>
                  <p className="font-semibold text-gray-900">Recipients</p>
                  <p className="text-xs text-gray-500">
                    Select one or more admins to receive this task/update
                  </p>
                </div>
                <span className="text-xs font-medium text-gray-400">
                  {selectedAdminIds.length} selected
                </span>
              </div>
              <div className="flex-1 overflow-hidden">
                <div className="h-[360px] overflow-y-auto">
                  {loadingAdmins ? (
                    <div className="p-4 text-sm text-gray-500">Loading admins...</div>
                  ) : admins.length === 0 ? (
                    <div className="p-4 text-sm text-gray-500">No admins available.</div>
                  ) : (
                    <div className="divide-y divide-gray-100">
                      {admins.map((admin) => (
                        <label
                          key={admin._id}
                          className="flex items-center justify-between px-4 py-3 text-sm text-gray-700 hover:bg-white"
                        >
                          <div className="flex items-center gap-3">
                            <input
                              type="checkbox"
                              checked={selectedAdminIds.includes(admin._id)}
                              onChange={() => handleAdminToggle(admin._id)}
                              className="h-4 w-4 text-teal-600 border-gray-300 rounded focus:ring-teal-500"
                            />
                            <div>
                              <p className="font-semibold text-gray-900">
                                {admin.firstName} {admin.lastName}
                              </p>
                              <p className="text-xs text-gray-400 capitalize">
                                {admin.role}
                              </p>
                            </div>
                          </div>
                          <span className="text-xs text-gray-400">{admin.email}</span>
                        </label>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Task History */}
      <div className="bg-white rounded-2xl shadow p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Sent Tasks / Updates</h2>
            <p className="text-xs text-gray-500">
              Manage and monitor all the tasks and updates you've assigned.
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-gray-100 rounded-full p-1">
              <button
                type="button"
                onClick={() => setActiveHistoryTab('Task')}
                className={`px-3 py-1 text-xs font-semibold rounded-full ${
                  activeHistoryTab === 'Task'
                    ? 'bg-teal-600 text-white'
                    : 'text-gray-700'
                }`}
              >
                Tasks
              </button>
              <button
                type="button"
                onClick={() => setActiveHistoryTab('Update')}
                className={`px-3 py-1 text-xs font-semibold rounded-full ${
                  activeHistoryTab === 'Update'
                    ? 'bg-teal-600 text-white'
                    : 'text-gray-700'
                }`}
              >
                Updates
              </button>
            </div>
            {historyLoading && (
              <span className="text-xs text-gray-500">Refreshing...</span>
            )}
          </div>
        </div>

        {tasks.length === 0 ? (
          <div className="text-sm text-gray-500">No tasks or updates sent yet.</div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {tasks
              .filter((task) => (task.taskType || 'Task') === activeHistoryTab)
              .map((task) => (
              <div
                key={task._id}
                className={`border border-gray-100 rounded-2xl p-4 shadow-sm ${
                  task.senderHasNewReply ? 'bg-yellow-50 border-yellow-200' : 'bg-gray-50'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-gray-900">
                      {getMessageSnippet(task.messageDetail)}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Deadline: {formatDeadline(task.deadline)}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Recipients: {getRecipientsDisplay(task)}
                    </p>
                  </div>
                  {task.senderHasNewReply && (
                    <span className="px-2 py-0.5 text-[11px] font-semibold bg-teal-100 text-teal-800 rounded-full whitespace-nowrap">
                      New Reply
                    </span>
                  )}
                </div>
                <div className="mt-4 flex items-center justify-end gap-3">
                  <button
                    onClick={() => openTaskModal(task)}
                    className="text-blue-600 hover:text-blue-800 text-xs font-semibold"
                  >
                    View / Reply
                  </button>
                  <button
                    onClick={() => handleDeleteTask(task._id)}
                    className="text-red-500 hover:text-red-700 text-xs font-semibold"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Task detail modal */}
      {isTaskModalOpen && selectedTask && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-[2000]">
          <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="px-6 py-4 border-b flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Task Details</h3>
                <p className="text-sm text-gray-500">
                  Deadline: {selectedTask.deadline ? new Date(selectedTask.deadline).toLocaleDateString() : 'N/A'}
                </p>
              </div>
              <button
                onClick={closeTaskModal}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
            <div className="p-6 space-y-6">
              <section>
                <h4 className="text-sm font-semibold text-gray-700">Message Detail</h4>
                <p className="mt-2 text-sm text-gray-800 whitespace-pre-line">
                  {selectedTask.messageDetail}
                </p>
              </section>

              <section>
                <h4 className="text-sm font-semibold text-gray-700">Recipients</h4>
                <div className="mt-2 border border-gray-200 rounded-md max-h-60 overflow-y-auto">
                  <table className="min-w-full text-sm">
                    <thead className="bg-gray-50 text-gray-500 uppercase text-xs">
                      <tr>
                        <th className="px-3 py-2 text-left">Name</th>
                        <th className="px-3 py-2 text-left">Email</th>
                        <th className="px-3 py-2 text-left">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {selectedTask.assignedTo.map((recipient, idx) => (
                        <tr key={idx}>
                          <td className="px-3 py-2 text-gray-800">
                            {recipient.adminId
                              ? `${recipient.adminId.firstName || ''} ${recipient.adminId.lastName || ''}`.trim() ||
                                recipient.adminId.email
                              : 'N/A'}
                          </td>
                          <td className="px-3 py-2 text-gray-500">
                            {recipient.adminId?.email || 'N/A'}
                          </td>
                          <td className="px-3 py-2">
                            <span
                              className={`px-2 py-0.5 rounded-full text-xs ${
                                recipient.isDeleted
                                  ? 'bg-gray-100 text-gray-600'
                                  : recipient.isRead
                                  ? 'bg-green-100 text-green-800'
                                  : 'bg-yellow-100 text-yellow-800'
                              }`}
                            >
                              {getRecipientStatus(recipient)}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>

              <section>
                <h4 className="text-sm font-semibold text-gray-700 mb-2">Reply Thread</h4>
                {selectedTask.replies.length === 0 ? (
                  <p className="text-sm text-gray-500">No replies yet.</p>
                ) : (
                  <div className="space-y-3">
                    {selectedTask.replies
                      .slice()
                      .sort(
                        (a, b) =>
                          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
                      )
                      .map((reply, index) => (
                        <div
                          key={index}
                          className="border border-gray-200 rounded-md p-3"
                        >
                          <div className="flex items-center justify-between text-xs text-gray-500">
                            <span className="font-medium text-gray-700">
                              {getReplyAuthor(reply)}
                            </span>
                            <span>{new Date(reply.timestamp).toLocaleString()}</span>
                          </div>
                          <p className="mt-2 text-sm text-gray-800 whitespace-pre-line">
                            {reply.replyMessage}
                          </p>
                        </div>
                      ))}
                  </div>
                )}
              </section>

              <section>
                <h4 className="text-sm font-semibold text-gray-700 mb-2">Add Reply</h4>
                <textarea
                  rows={3}
                  value={modalReply}
                  onChange={(e) => setModalReply(e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-teal-500 focus:border-teal-500"
                  placeholder="Reply to the thread..."
                />
                <div className="flex justify-end mt-3">
                  <button
                    onClick={handleModalReplySubmit}
                    disabled={modalReplyLoading || !modalReply.trim()}
                    className="px-4 py-2 text-sm rounded-md bg-teal-600 text-white hover:bg-teal-700 disabled:opacity-60"
                  >
                    {modalReplyLoading ? 'Sending...' : 'Send Reply'}
                  </button>
                </div>
              </section>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateAdminTask;


