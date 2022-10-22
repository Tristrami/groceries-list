import Header from "./Header";
import SearchItem from "./SearchItem";
import AddItem from "./AddItem";
import Content from "./Content";
import Footer from "./Footer";
import { useState } from "react";

function App() {

  const itemsFromLocal = JSON.parse(localStorage.getItem("shoppingList"));
  const [items, setItems] = useState(itemsFromLocal);

  // 使用 newItem 来与 add item 输入框的 value 绑定
  const [newItem, setNewItem] = useState("");
  // 使用 search 来与 search item 输入框的 value 绑定
  const [searchContent, setSearchContent] = useState("");

  const handleCheck = (id) => {
    const listItems = items.map(
      (item) => item.id === id 
        ? { ...item, checked: !item.checked } 
        : item
    );
    setAndSaveItems(listItems);
  }

  const handleDelete = (id) => {
    const listItems = items.filter(
      (item) => item.id !== id
    );
    setAndSaveItems(listItems);
  }

  const addItem = (item) => {
    const len = items.length;
    const id = len ? items[len - 1].id + 1 : 1;
    const newItemObject = {
      id: id,
      checked: false,
      item: item
    };
    const newItemList = [...items, newItemObject];
    setAndSaveItems(newItemList);
  }

  const handleSubmit = (event) => {
    // 避免事件触发后的默认行为，这里是防止点击提交按钮后页面刷新
    event.preventDefault();
    if (!newItem) return;
    addItem(newItem);
    // 将 newItem 设置为空串，这样与之绑定的输入框的 value 也被清空
    setNewItem("");
  }

  const setAndSaveItems = (newItems) => {
    setItems(newItems);
    localStorage.setItem("shoppingList", JSON.stringify(newItems));
  }

  return (
    <div className="App">
      {/* props drilling，将 title 属性封装到 props 中传递给 Header 组件函数 */}
      <Header title="Groceries List" />
      <AddItem 
        newItem={newItem}
        setNewItem={setNewItem}
        handleSubmit={handleSubmit}
      />
      <SearchItem 
        searchContent={searchContent}
        setSearchContent={setSearchContent}
      />
      <Content 
        items={
          items.filter(
            item => item.item
              .toLowerCase()
              .includes(searchContent.toLowerCase())
          )
        } 
        handleCheck={handleCheck}
        handleDelete={handleDelete}
      />
      <Footer length={items.length} />
    </div>
  );
}

export default App;
