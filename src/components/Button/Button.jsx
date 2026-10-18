import './Button.css'

function Button({ children, className = '' }) {
  return (
    <button type="button" className={`button ${className}`.trim()} tabIndex={-1}>
      {children}
    </button>
  )
}

export default Button
