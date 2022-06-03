import { useState } from 'react';

export interface IUseModal {
  open: boolean;
  handleOpenModal: () => void;
  handleCloseModal: () => void;
}

const UseModal = (): IUseModal => {
  const [open, setOpen] = useState(false);
  const handleOpenModal = () => setOpen(true);
  const handleCloseModal = () => setOpen(false);

  return { handleOpenModal, handleCloseModal, open };
};

export default UseModal;
