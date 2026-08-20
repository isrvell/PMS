import "./Avatar.css";
function Avatar({ size = 40, name, src }) {
  return (
    <div className="avatar" style={{ width: size, height: size }}>
      {src ? (
        <img
          src={src}
          alt={name}
          style={{
            width: "100%",
            height: "100%",
            borderRadius: "50%",
            objectFit: "cover",
          }}
        />
      ) : (
        <i
          className="bi bi-person-circle"
          style={{ fontSize: size * 0.65 }}
        ></i>
      )}
    </div>
  );
}

export default Avatar;
