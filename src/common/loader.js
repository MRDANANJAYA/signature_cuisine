const Loader = () => {
  return (
    <div
      className="text-center"
      style={{ minHeight: "100%", position: "absolute", top: "50%" ,left:'50%'}}
    >
      <div
        className="spinner-grow"
        style={{ width: "3rem", height: "3rem" }}
        role="status"
      >
        <span className="visually-hidden">Loading...</span>
      </div>
    </div>
  );
};

export default Loader;
