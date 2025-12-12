
import React from 'react';
import { LayoutDashboard, ShoppingBag, Users, Tag, Plus } from 'lucide-react';
import { COUPONS } from '../services/mockData';
import { useShop } from '../store/ShopContext';

const Admin = () => {
  const { orders } = useShop();

  const totalSales = orders.reduce((acc, order) => acc + order.total, 0);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-white neon-text">Admin Dashboard</h1>
        <div className="flex gap-2">
            <button className="bg-orange-600 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 hover:bg-orange-500">
                <Plus className="w-4 h-4" /> Add Product
            </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {[
            { label: 'Total Sales', value: `₹${totalSales.toLocaleString()}`, icon: <Tag className="w-5 h-5 text-blue-400" />, bg: 'bg-blue-500/10 border-blue-500/20' },
            { label: 'Active Orders', value: orders.length.toString(), icon: <ShoppingBag className="w-5 h-5 text-orange-400" />, bg: 'bg-orange-500/10 border-orange-500/20' },
            { label: 'Customers', value: '892', icon: <Users className="w-5 h-5 text-green-400" />, bg: 'bg-green-500/10 border-green-500/20' },
            { label: 'Avg Order', value: `₹${orders.length > 0 ? Math.round(totalSales / orders.length) : 0}`, icon: <LayoutDashboard className="w-5 h-5 text-purple-400" />, bg: 'bg-purple-500/10 border-purple-500/20' },
        ].map((stat, i) => (
            <div key={i} className={`p-6 rounded-xl border ${stat.bg} backdrop-blur-sm`}>
                <div className="flex justify-between items-start mb-4">
                    <div className="p-3 rounded-lg bg-stone-900/50">{stat.icon}</div>
                </div>
                <h3 className="text-2xl font-bold text-white">{stat.value}</h3>
                <p className="text-sm text-stone-400">{stat.label}</p>
            </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Orders Table */}
        <div className="bg-stone-900 rounded-xl shadow-lg border border-stone-800 overflow-hidden">
            <div className="p-6 border-b border-stone-800 flex justify-between items-center">
                <h3 className="font-bold text-lg text-white">Recent Orders</h3>
                <button className="text-sm text-orange-500 hover:text-orange-400">View All</button>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-stone-400">
                    <thead className="bg-stone-950 text-stone-500 uppercase text-xs">
                        <tr>
                            <th className="p-4 font-medium">Order ID</th>
                            <th className="p-4 font-medium">Customer</th>
                            <th className="p-4 font-medium">Status</th>
                            <th className="p-4 font-medium text-right">Amount</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-800">
                        {orders.map(order => (
                            <tr key={order.id} className="hover:bg-stone-800/50 transition">
                                <td className="p-4 font-medium text-white">{order.id}</td>
                                <td className="p-4">{order.customerName}</td>
                                <td className="p-4">
                                    <span className={`px-2 py-1 rounded text-xs font-semibold ${
                                        order.status === 'Delivered' ? 'bg-green-900/30 text-green-400 border border-green-900' :
                                        order.status === 'Processing' ? 'bg-yellow-900/30 text-yellow-400 border border-yellow-900' :
                                        'bg-blue-900/30 text-blue-400 border border-blue-900'
                                    }`}>
                                        {order.status}
                                    </span>
                                </td>
                                <td className="p-4 text-right font-medium text-white">₹{order.total}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>

        {/* Coupon Management */}
        <div className="bg-stone-900 rounded-xl shadow-lg border border-stone-800 overflow-hidden">
            <div className="p-6 border-b border-stone-800 flex justify-between items-center">
                <h3 className="font-bold text-lg text-white">Active Coupons</h3>
                <button className="text-sm text-orange-500 hover:text-orange-400">Manage</button>
            </div>
            <div className="p-6 space-y-4">
                {COUPONS.map((coupon, i) => (
                    <div key={i} className="flex justify-between items-center p-4 border border-stone-800 rounded-lg hover:border-orange-500/30 transition bg-stone-950/50">
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <span className="font-bold text-white text-lg tracking-wider font-mono">{coupon.code}</span>
                                <span className="text-[10px] bg-stone-800 px-2 py-0.5 rounded text-stone-400">{coupon.discountType}</span>
                            </div>
                            <p className="text-sm text-stone-500">{coupon.description}</p>
                        </div>
                        <div className="text-right">
                             <div className="font-bold text-green-400 text-lg">
                                {coupon.discountType === 'PERCENTAGE' ? `${coupon.value}%` : `₹${coupon.value}`}
                             </div>
                             <div className="text-xs text-stone-600">Off</div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;
