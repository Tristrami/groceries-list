import Header from "./Header";
import SearchItem from "./SearchItem";
import AddItem from "./AddItem";
import Content from "./Content";
import Footer from "./Footer";
import { useEffect, useState } from "react";
import apiRequest from "./apiRequest";

function App() {

  // json-server rest api
  const API_URL = "http://localhost:3500/items";
  // useState hook 可以方便我们创建 state，也就是需要被 track 的一个变量，函数返回两个值，
  // 第一个是 state 变量，第二个是 state 变量对应的 setter，当我们调用 setter 改变 state
  // 变量的值时，React 会重新渲染相应的组件
  const [items, setItems] = useState([]);
  // 使用 newItem 来与 add item 输入框的 value 绑定
  const [newItem, setNewItem] = useState("");
  // 使用 search 来与 search item 输入框的 value 绑定
  const [searchContent, setSearchContent] = useState("");
  // 创建一个 state 变量来记录获取数据时是否出错，如果出错，在前端页面中渲染相应错误信息
  const [fetchError, setFetchError] = useState(null);
  // 创建一个 state 变量来记录应用是否正在加载数据，如果正在加载，要在前端页面显示提示
  const [isLoading, setIsLoading] = useState(true);

  // useEffect hook 接受两个参数，第一个是 (effect) 函数，第二个是 (dependency) 数组，
  // 当 dependency 的值发生改变时，会触发 effect 函数，useEffect 在应用第一次加载时会被
  // 调用，当 dependency 数组中没有元素时，这个 hook 就只会在应用在应用第一次加载时被调用，
  // 要注意给 useEffect() 传入的 effect 函数不可以是 async
  useEffect(() => {

    const fetchItems = async () => {
      try {
        const response = await fetch(API_URL);
        // 如果请求未成功，fetch() 函数并不会抛出错误，所以这里要手动判断，自己抛出错误
        if (!response.ok) throw Error("Did not receive expected data");
        const listItems = await response.json();
        setItems(listItems);
        setFetchError(null);
      } catch (err) {
        setFetchError(err.message);
      } finally {
        setIsLoading(false);
      }
    }
    // 由于 effect 函数不可以是 async，所以这里声明一个匿名 async 函数并立即调用，
    // 以此来间接调用 fetchItems() 函数，这里使用一下 setTImeout 来模拟真实调用
    // api 的速度
    setTimeout(() => {
      (async () => await fetchItems())();
    }, 1000);

  }, []);

  const handleCheck = async (id) => {
    const listItems = items.map(
      (item) => item.id === id 
        ? { ...item, checked: !item.checked } 
        : item
    );
    setItems(listItems);

    const checkStateChangedItem = listItems.filter((item) => item.id === id)[0];
    const patchOptions = {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json"
      },
      // 这里传过去的对象只需要包含要更新的属性
      body: JSON.stringify({ checked: checkStateChangedItem.checked })
    };
    const requestUrl = `${API_URL}/${id}`;
    const result = await apiRequest(requestUrl, patchOptions);
    if (result) setFetchError(result);
  }

  const handleDelete = async (id) => {
    const listItems = items.filter(
      (item) => item.id !== id
    );
    setItems(listItems);

    const deleteOptions = { method: "DELETE" };
    const requestUrl = `${API_URL}/${id}`;
    const result = await apiRequest(requestUrl, deleteOptions);
    if (result) setFetchError(result);
  }

  const addItem = async (item) => {
    // 更新本地 items 数组
    const len = items.length;
    const id = len ? items[len - 1].id + 1 : 1;
    const newItemObject = {
      id: id,
      checked: false,
      item: item
    };
    const newItemList = [...items, newItemObject];
    setItems(newItemList);
    // 更新 jb.json 模拟数据库
    const postOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(newItemObject)
    };
    const result = await apiRequest(API_URL, postOptions);
    if (result) setFetchError(result);
  }

  const handleSubmit = (event) => {
    // 避免事件触发后的默认行为，这里是防止点击提交按钮后页面刷新
    event.preventDefault();
    if (!newItem) return;
    addItem(newItem);
    // 将 newItem 设置为空串，这样与之绑定的输入框的 value 也被清空
    setNewItem("");
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
      <main>
        {/* JS 的 && 表达式会返回第一个运算结果为 false 的表达式的值，如果没有 false 会返回最后一个运算元的值 */}
        {isLoading && <p>Loading Items ...</p>}
        {fetchError && <p style={{ color: "red" }}>{`Error: ${fetchError}`}</p>}
        {!fetchError && !isLoading && <Content 
          items={
            items.filter(
              item => item.item
                .toLowerCase()
                .includes(searchContent.toLowerCase())
            )
          } 
          handleCheck={handleCheck}
          handleDelete={handleDelete}
        />}
      </main>
      <Footer length={items.length} />
    </div>
  );
}

export default App;
