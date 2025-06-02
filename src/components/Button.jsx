export default function Button({ children, style, onClick, disabled, className = "", ...props }) {
  return (
    <button
      className={`btn ${className}`}
      style={style}
      onClick={onClick}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
}
