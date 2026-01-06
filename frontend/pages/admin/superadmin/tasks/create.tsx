import React from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import CreateAdminTask from '@/components/admin/superadmin/CreateAdminTask';

const CreateAdminTaskPage: React.FC = () => {
  return (
    <AdminLayout>
      <div className="py-6">
        <div className="mx-auto px-4 sm:px-6 md:px-8">
          <div className="mb-6">
            <h1 className="text-2xl font-semibold text-gray-900">Team Tasks & Updates</h1>
            <p className="mt-1 text-sm text-gray-500">
              Create new announcements or tasks for your admin team and review the history of items
              you&apos;ve sent.
            </p>
          </div>
          <CreateAdminTask />
        </div>
      </div>
    </AdminLayout>
  );
};

export default CreateAdminTaskPage;


