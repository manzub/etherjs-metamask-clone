import { Alert as ReactAlert } from "react-bootstrap"

export default function Alert({ children, variant, onClick }) {
  return(<ReactAlert style={{padding:'10px'}} variant={variant} onClick={onClick}>
    <div className="d-flex align-items-center justify-content-between">
    {children}
    <span onClick={onClick} style={{fontSize:15}}>&times;</span>
    </div>
  </ReactAlert>)
}