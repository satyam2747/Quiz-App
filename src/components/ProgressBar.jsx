function ProgressBar({ current, total }) {
  // Calculate progress percentage
  const percentage = (current / total) * 100

  return (
    <div className="w-full">
      {/* Progress label and counter */}
      <div className="flex justify-between text-sm mb-2">
        <span>Progress</span>
        <span>
          {current} of {total}
        </span>
      </div>

      {/* Progress bar background */}
      <div className="w-full bg-blue-200 rounded-full h-2">
        {/* Progress fill (width changes based on percentage) */}
        <div
          className="bg-white h-2 rounded-full transition-all duration-300 ease-out"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  )
}

export default ProgressBar
