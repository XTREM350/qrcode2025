import React from 'react';
import Card from '../../components/ui/Card';
import { Award } from 'lucide-react';

const AdminBadges = () => {
  return (
    <div className="p-6">
      <div className="flex items-center gap-3 mb-6">
        <Award className="w-6 h-6 text-primary" />
        <h1 className="text-2xl font-semibold text-gray-900">Badge Management</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <div className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Create Badge</h2>
            <p className="text-gray-600">Add new achievement badges for students</p>
          </div>
        </Card>

        <Card>
          <div className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Assign Badges</h2>
            <p className="text-gray-600">Award badges to deserving students</p>
          </div>
        </Card>

        <Card>
          <div className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Badge Analytics</h2>
            <p className="text-gray-600">Track badge distribution and impact</p>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default AdminBadges;