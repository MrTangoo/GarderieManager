export default function TextInputWithIcon({icon, value, onChange, placeholder, type = 'text', disabled, required = true, ...rest}) {
    return (
        <div className="relative w-full">
      <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">
        {icon}
      </span>
            <input
                type={type}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                disabled={disabled}
                required={required}
                className={`border border-gray-300 p-2 rounded w-full pl-10 focus:outline-none focus:ring-2 focus:ring-blue-300 ${
                    disabled ? 'bg-gray-100 text-gray-500 cursor-not-allowed' : ''
                }`}
                {...rest}
            />
        </div>
    )
}
