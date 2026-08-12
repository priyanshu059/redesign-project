// src/components/common/Spinner.jsx - Loading Spinner
const Spinner = ({ size = 'md' }) => {
  const sizes = { sm: 'h-4 w-4 border-2', md: 'h-8 w-8 border-3', lg: 'h-12 w-12 border-4' };
  return (
    <div className="flex justify-center items-center p-4">
      <div className={`${sizes[size]} animate-spin rounded-full border-zinc-800 border-t-indigo-500`}></div>
    </div>
  );
};
export default Spinner;
