import { X } from 'lucide-react';
const Modal = ({ isOpen, onClose, children }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg w-full max-w-7xl max-h-[130vh] overflow-hidden">
                <div className="flex justify-between items-center p-6 border-b border-gray-200 bg-slate-800">
                    <h2 className="text-xl font-semibold text-white">상세 데이터 보기</h2>
                    <button
                        onClick={onClose}
                        className="text-white hover:text-gray-300 transition-colors"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>
                <div className="p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
                    {children}
                </div>
            </div>
        </div>
    );
};

export default Modal;