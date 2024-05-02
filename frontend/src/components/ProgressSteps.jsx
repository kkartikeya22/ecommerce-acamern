const ProgressSteps = ({ step1, step2, step3 }) => {
  return (
    <div className="flex justify-center items-center space-x-4 mt-6">
      {/* Step 1: Login */}
      <div className="flex flex-col items-center">
        <div
          className={`w-8 h-8 flex items-center justify-center rounded-full border-2 ${
            step1 ? "bg-green-500 border-green-500 text-white" : "bg-white border-gray-300 text-gray-300"
          }`}
        >
          {step1 ? '✅' : '1'}
        </div>
        <span className={`text-sm mt-1 ${step1 ? "text-green-500" : "text-gray-300"}`}>
          Login
        </span>
      </div>

      {/* Step 1 to Step 2 line */}
      {step1 && (
        <div className={`w-10 h-1 ${step2 ? "bg-green-500" : "bg-gray-300"}`}></div>
      )}

      {/* Step 2: Shipping */}
      {step2 && (
        <div className="flex flex-col items-center">
          <div
            className={`w-8 h-8 flex items-center justify-center rounded-full border-2 ${
              step2 ? "bg-green-500 border-green-500 text-white" : "bg-white border-gray-300 text-gray-300"
            }`}
          >
            {step2 ? '✅' : '2'}
          </div>
          <span className={`text-sm mt-1 ${step2 ? "text-green-500" : "text-gray-300"}`}>
            Shipping
          </span>
        </div>
      )}

      {/* Step 2 to Step 3 line */}
      {step2 && (
        <div className={`w-10 h-1 ${step3 ? "bg-green-500" : "bg-gray-300"}`}></div>
      )}

      {/* Step 3: Summary */}
      <div className="flex flex-col items-center">
        <div
          className={`w-8 h-8 flex items-center justify-center rounded-full border-2 ${
            step3 ? "bg-green-500 border-green-500 text-white" : "bg-white border-gray-300 text-gray-300"
          }`}
        >
          {step3 ? '✅' : '3'}
        </div>
        <span className={`text-sm mt-1 ${step3 ? "text-green-500" : "text-gray-300"}`}>
          Summary
        </span>
      </div>
    </div>
  );
};

export default ProgressSteps;
