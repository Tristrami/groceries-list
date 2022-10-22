import React from "react";
import { FaPlus } from "react-icons/fa";
import { useRef } from "react";

// 🌟 将 input 的 value 值与 newItem 相互绑定
// 这里我们想要输入框里的内容改变时，input 标签的 value 属性跟着改变，我们可以让
// value={newItem}，这样就将 value 与 newItem 绑定了，再使用 onChange 事件
// 来指定每次输入内容发生变化时，就调用 setNewItem(e.target.value)，这时该组件
// 就会被重新渲染，input 标签的 value 值也就随之改变了，这样 newItem 也就与 
// value 绑定了

// 🌟 改变 form 表单提交后的行为
// form 表单在提交时会自动刷新页面，我们可以通过 form 标签的 onSubmit 事件来控制
// 提交后的行为，这里会去调用 handleSubmit() 函数，要注意的是，JS 会自动帮我们把
// event 对象传递给函数，我们不需要在显式的传递 event 对象

const AddItem = ({ newItem, setNewItem, handleSubmit }) => {

  // useRef hook 可以为变量或者 dom 元素创建一个引用，可以在不同组件里引用这个变量，
  // useRef() 函数会创建一个对象，里面只有 current 属性，代表变量当前的值，这里为
  // <input /> 标签创建了一个引用，我们需要在相应的 <input /> 标签中添加 ref 属性，
  // 属性值当前创建的引用，也就是需要 ref={inputRef}
  // https://www.w3schools.com/react/react_useref.asp
  const inputRef = useRef();

  return (
    <form className="addForm" onSubmit={handleSubmit}>
      <label htmlFor="addItem">Add Item</label>
      <input 
        autoFocus
        ref={inputRef}
        id="addItem"
        type="text"
        placeholder="Add Item"
        required
        value={newItem}
        onChange={(e) => setNewItem(e.target.value)}
      />
      <button
        type="submit"
        aria-label="Add Item"
        onClick={() => inputRef.current.focus()}
      ><FaPlus /></button>
    </form>
  )
};

export default AddItem;