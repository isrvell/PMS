import "./Avatar.css";
function Avatar({ size = 40 }) {
  return (
    <div className="avatar" style={{ width: size, height: size }}>
      <i className="bi bi-person-circle" style={{ fontSize: size * 0.65 }}></i>
    </div>
  );
}

export default Avatar;
