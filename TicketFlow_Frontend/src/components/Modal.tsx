import "./Modal.css"

interface ModalProps{
    isOpen: boolean;
    title?: string;
    message?: string;
    onConfirm: () => void;
    onCancel: () => void;
}

export function ConfirmModal(props: ModalProps){
    const {isOpen,title,message,onConfirm,onCancel} = props;
    return (
        isOpen && (
            <section className="modal-overlay" onClick={onCancel}>
                <div className="modal-box" onClick={(e) => e.stopPropagation()}>
                    <h2>{title}</h2>
                    <p>{message}</p>
                    <div className="modal-buttons">
                        <button className="btn-cancel" onClick={onCancel}>Cancelar</button>
                        <button className="btn-confirm" onClick={onConfirm}>Aceptar</button>
                    </div>
                </div>
            </section>
        )
    )
}