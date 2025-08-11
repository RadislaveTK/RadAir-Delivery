import { useNavigate } from "react-router-dom";

export default function BackBtn() {
  const navigate = useNavigate();

  const style = {
    position: "absolute",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    flexDirection: "row",
    background: "#963736",
    // border: "2px solid #FF9800",
    border: "none",
    borderRadius: "15px",
    width: "120px",
    height: "40px",
    color: "#fff",
    fontSize: "20px",
    padding: "0 10px",
    // top: "15%",
    left: "5%",
    cursor: "pointer",
    zIndex: 14,
    top: "10px",
    boxShadow: "3px 3px 0px 0px rgba(255, 152, 0, 1), 0px 4px 4px 0px rgba(0, 0, 0, 0.25)",
  };

  return (
    <button className="back-btn" style={style} onClick={() => navigate(-1)}>
      <img src="/assets/icons/undo.svg" width={25} alt="img" />
      Назад
    </button>
  );
}
