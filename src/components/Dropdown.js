import React from "react";
import { Dropdown as ReactDropdown } from "react-bootstrap";

export default function Dropdown({ toggle, children  }) {

  const Toggle = React.forwardRef(({ children, onClick }, ref) => (
    <span ref={ref} onClick={(e) => {
      e.preventDefault();
      onClick(e);
    }}>{children}</span>
  ))

  const Menu = React.forwardRef(({ children, style, className, 'aria-labelledby': labeledBy }, ref) => {
    // eslint-disable-next-line no-unused-vars
    const [value, setValue] = React.useState('');

    return(<div
    ref={ref}
    style={style}
    className={className}
    aria-labelledby={labeledBy}>
      <ul className="list-unstyled">
        {React.Children.toArray(children).filter((child) => !value || child.props.children.toLowerCase().startsWith(value),)}
      </ul>
    </div>)
  })

  return(<ReactDropdown>
    <ReactDropdown.Toggle as={Toggle}>{toggle || ''}</ReactDropdown.Toggle>

    <ReactDropdown.Menu as={Menu}>
      {children}
      {/* {[...items].map((item, idx) => (<ReactDropdown.Item style={{backgroundColor: item.variant ? item.variant : null}} active={item.active} key={idx} eventKey={idx} onClick={item.onClick}>{item.value}</ReactDropdown.Item>))} */}
    </ReactDropdown.Menu>
  </ReactDropdown>)
}