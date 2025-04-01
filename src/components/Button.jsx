export default function Button({children, style, onClick, disabled}) {

  return (
    <button className="btn" style={style} onClick={onClick} disabled={disabled}>
      {children}
    </button>
  );
}
