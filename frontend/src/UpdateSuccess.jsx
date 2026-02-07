import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle, ArrowLeft, Shield } from 'lucide-react';

const UpdateSuccess = () => {
  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 text-white">
      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-green-500/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 bg-slate-900/80 backdrop-blur-xl border border-slate-700 rounded-2xl p-8 md:p-12 text-center max-w-md w-full shadow-2xl animate-in zoom-in-95 duration-300">
        
        <div className="w-24 h-24 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle size={48} className="text-green-500" />
        </div>

        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-cyan-500 mb-4">
            Success!
        </h1>
        
        <p className="text-slate-400 mb-8 text-lg">
            The component has been updated successfully and is now live in the library.
        </p>

        <div className="flex flex-col gap-3">
            <Link 
                to="/admin" 
                className="w-full py-3 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl border border-slate-700 transition-colors flex items-center justify-center gap-2"
            >
                <ArrowLeft size={18} /> Back to Dashboard
            </Link>
            
            <Link 
                to="/study" 
                className="w-full py-3 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold rounded-xl shadow-lg transition-all"
            >
                View in Study Guide
            </Link>
        </div>

      </div>
    </div>
  );
};

export default UpdateSuccess;
