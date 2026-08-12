// src/components/common/Modal.jsx - Reusable Modal Dialog
const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-[#09090b]/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-zinc-900 border border-zinc-800 rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden">
        <div className="flex justify-between items-center p-6 border-b border-zinc-800/80 bg-zinc-900/50">
          <h3 className="text-white font-bold text-xl tracking-tight">{title}</h3>
          <button 
            onClick={onClose} 
            className="w-8 h-8 flex items-center justify-center rounded-full bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-white transition-colors border border-zinc-700"
            aria-label="Close modal"
          >
            &times;
          </button>
        </div>
        <div className="p-6 text-zinc-300">
          {children}
        </div>
      </div>
    </div>
  );
};
export default Modal;
