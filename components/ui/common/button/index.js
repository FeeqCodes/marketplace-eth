
const SIZE = {
  sm: "p-2 text-base xs:px-4",
  md: "p-3 text-base xs:px-8",
  lg: "p-3 text-lg xs:px-10",
}


export default function Button({
  children,
  className,
  size = "md",
  hoverable = true,
  variant = "purple",
  ...rest
}) {

  const sizeClass = SIZE[size]
  const variants = {
    purple: `text-white bg-indigo-600 ${hoverable && "hover:bg-indigo-700"}`,
    red: `text-white bg-red-600 ${hoverable && "hover:bg-red-700"}`,
    purple: `text-white bg-indigo-600 ${hoverable && "hover:bg-indigo-700"}`,
    blue: `text-white bg-blue-600 ${hoverable && "hover:bg-red-700"}`,
    lightPurple: `text-indigo-700 bg-indigo-100 ${hoverable && "hover:bg-indigo-200"}`,
    green: `text-green-700 bg-green-100 ${hoverable && "hover:bg-green-200"}`,
    white: `text-black bg-white`
    
  }

  return (
    <button
      {...rest}
      className={`${sizeClass} disabled:opacity-50 disabled:cursor-not-allowed  border rounded-md  font-medium ${className} ${variants[variant]}`}>
      {children}
    </button>
  )
}

// we created a  hoverable state so we can select on what variants we would like to hover