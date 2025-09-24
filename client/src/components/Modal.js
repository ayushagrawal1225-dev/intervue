import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { selectModal, closeModal } from "../store/slices/uiSlice";

const Modal = () => {
  const dispatch = useDispatch();
  const modal = useSelector(selectModal);

  if (!modal.isOpen) return null;

  const handleConfirm = () => {
    if (modal.onConfirm) {
      modal.onConfirm();
    }
    dispatch(closeModal());
  };

  const handleCancel = () => {
    if (modal.onCancel) {
      modal.onCancel();
    }
    dispatch(closeModal());
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <div
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
          onClick={handleCancel}
        />

        {/* Modal panel */}
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="sm:flex sm:items-start">
              {modal.type === "confirm" && (
                <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-error-100 sm:mx-0 sm:h-10 sm:w-10">
                  <svg
                    className="h-6 w-6 text-error-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                    />
                  </svg>
                </div>
              )}

              <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                {modal.title && (
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    {modal.title}
                  </h3>
                )}

                {modal.content && (
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">{modal.content}</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            {modal.type === "confirm" ? (
              <>
                <button
                  type="button"
                  onClick={handleConfirm}
                  className="btn-error w-full sm:ml-3 sm:w-auto"
                >
                  Confirm
                </button>
                <button
                  type="button"
                  onClick={handleCancel}
                  className="btn-outline mt-3 w-full sm:mt-0 sm:w-auto"
                >
                  Cancel
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={handleCancel}
                className="btn-primary w-full sm:w-auto"
              >
                OK
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
