import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle, ArrowLeft, Shield } from 'lucide-react';

const UpdateSuccess = () => {
  return (
    <div className="page-shell relative flex items-center justify-center p-4">
      <div className="bg-mesh" />

      <div className="relative z-10 card-elevated p-8 sm:p-12 text-center max-w-md w-full">
        
        <div className="w-20 h-20 bg-tw-success/10 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-tw-success/20">
            <CheckCircle size={40} className="text-tw-success" />
        </div>

        <h1 className="text-2xl sm:text-3xl font-bold gradient-text mb-4">
            Success!
        </h1>
        
        <p className="text-tw-muted mb-8 text-base sm:text-lg">
            The component has been updated successfully and is now live in the library.
        </p>

        <div className="flex flex-col gap-3">
            <Link to="/admin" className="btn btn-secondary w-full py-3">
                <ArrowLeft size={18} /> Back to Dashboard
            </Link>
            
            <Link to="/study" className="btn btn-primary w-full py-3">
                View Guide / AI Course
            </Link>
        </div>

      </div>
    </div>
  );
};

export default UpdateSuccess;
