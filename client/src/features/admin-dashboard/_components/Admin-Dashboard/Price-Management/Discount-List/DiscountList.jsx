const DiscountList = ({ discounts, isEditing, onDelete }) => {
  if (Object.keys(discounts).length === 0) {
    return <div className="text-gray-500 italic mt-4 text-center">No discounts added</div>
  }

  return (
    <div className="mt-4 space-y-2">
      <div className="grid grid-cols-3 font-medium text-gray-600 mb-2 px-2">
        <div>Slots</div>
        <div>Discount</div>
        {isEditing && <div>Action</div>}
      </div>
      {Object.entries(discounts).map(([slot, discount]) => (
        <div key={slot} className="grid grid-cols-3 items-center bg-gray-50 p-3 rounded-lg">
          <div className="font-medium">{slot} slots</div>
          <div className="text-green-600 font-medium">{discount}%</div>
          {isEditing && (
            <div>
              <button onClick={() => onDelete(slot)} className="text-red-500 hover:text-red-700 transition-colors">
                <i className="fa-solid fa-trash text-[18px]"></i>
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

export default DiscountList