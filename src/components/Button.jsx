export default function Button({children, style, onClick, disabled}, ...props) {

  return (
    <button className="btn" {...props} style={style} onClick={onClick} disabled={disabled}>
      {children}
    </button>
  );
}
