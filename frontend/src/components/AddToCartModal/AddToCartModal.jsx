import { forwardRef, useRef, useImperativeHandle } from "react";
import { createPortal } from "react-dom"
import "./AddToCartModal.scss";
import { Link } from "react-router-dom";

const AddToCartModal = forwardRef(function AddToCartModal({user}, ref){
    const dialog = useRef();

    useImperativeHandle(ref, () =>{
        return{
            open() {
                dialog.current.showModal();
            }
        }
      })

      return createPortal(
        <dialog ref={dialog} className="addItemModal">
            <div className="modalContent">
                {user ? <>
                        <h2><i className="bi bi-check2-circle"></i> Item added to cart!</h2>
                        <form method="dialog">
                            <button className='addToCartBtn'>Continue shopping</button>
                        </form>
                
                </> : 
                <>
                    <h2><i className="bi bi-person-fill-exclamation"></i> Oops..</h2>
                    <p>Seems like you need to <strong>log in </strong>or <strong>register</strong> in order to complete the order.</p>
                    <Link className="goToLogin viewProducts" to="/login">Please login</Link>
                </>
                }
            </div>
        </dialog>, document.getElementById('modals')
      )
})

export default AddToCartModal;