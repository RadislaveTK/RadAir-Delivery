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
    border: "2px solid #FF9800",
    borderRadius: "10px",
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
  };

  return (
    <button className="back-btn" style={style} onClick={() => navigate(-1)}>
      <img src="/assets/icons/undo.svg" width={25} alt="img" />
      Назад
    </button>
  );
}
