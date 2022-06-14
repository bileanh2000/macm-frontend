function DialogCommon({ message, onDialog, params }) {
    return (
        <div
            style={{
                position: "fixed",
                top: "0",
                left: "0",
                right: "0",
                bottom: "0",
                backgroundColor: "rgba(0,0,0,0.5)"
            }}
            onClick={() => onDialog(false)}
        >
            <div
                onClick={(e) => e.stopPropagation()}
                style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%,-50%)",
                    background: "white",
                    padding: "20px",
                    borderRadius: "10px"
                }}
            >
                <h3 style={{ color: "#111", fontSize: "16px", margin: 20 }}>{message}</h3>
                <div style={{ display: "flex", alignItems: "center" }}>
                    <button
                        onClick={() => onDialog(false, params)}
                        style={{
                            background: "while",
                            color: "black",
                            padding: "20px",
                            marginRight: "4px",
                            border: "1px solid black",
                            borderRadius: 5,
                            cursor: "pointer"
                        }}
                    >
                        Hủy
                    </button>
                    <button
                        onClick={() => onDialog(true, params)}
                        style={{
                            background: "black",
                            color: "white",
                            padding: "20px",
                            marginLeft: "4px",
                            border: "1px solid black",
                            borderRadius: 5,
                            cursor: "pointer"
                        }}
                    >
                        Có, tôi chắc chắn
                    </button>
                </div>
            </div>
        </div>
    );
}
export default DialogCommon;
