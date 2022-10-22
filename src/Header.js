import React from "react";

// cmd + shift + r 打开快捷键搜索，输入 rafce 创建 react 组件的箭头函数
const Header = (props) => {

  return (
    <header>
      <h1>{props.title}</h1>
    </header>
  );
};

// 设置默认的 props，当父组件未传递 props 时，使用该 props
Header.defaultProps = {
  title: "Default Title",
};

export default Header;
