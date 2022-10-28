import Modal from 'react-modal'
import { useEffect } from 'react'
const customStyles = {
  overlay: {
    backgroundColor: 'rgba(35, 38, 47, 0.3)',
  },
  content: {
    backgroundColor: '#131419',
    borderRadius: '12px',
    border: 'none',
    top: '45%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    width: 600,
  },
}

export default function ModalNew(props) {
  const { title, closeModal, modalIsOpen, children } = props

  useEffect(() => {
    Modal.setAppElement('body')
  }, [])

  return (
    <Modal isOpen={modalIsOpen} onRequestClose={closeModal} style={customStyles}>
      <div>{children}</div>
    </Modal>
  )
}
