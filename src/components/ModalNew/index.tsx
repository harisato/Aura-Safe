import Modal from 'react-modal'

const customStyles = {
  overlay: {
    backgroundColor: 'rgba(35, 38, 47, 0.3)',
  },
  content: {
    backgroundColor: '#131419',
    borderRadius: '12px',
    border: 'none',
    top: '30%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
  },
}

export default function ModalNew(props) {
  const { title, closeModal, modalIsOpen, children } = props

  return (
    <Modal isOpen={modalIsOpen} onRequestClose={closeModal} style={customStyles}>
      <div>{children}</div>
    </Modal>
  )
}
