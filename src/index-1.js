const workList = [];
const contetnBox = document.querySelector("#app");

let list = [
  {
    value: "低",
  },
  {
    value: "中",
  },
  {
    value: "高",
  },
]

list.forEach(item => {
  const btn = document.createElement("button");
  btn.innerText = item.value;
  contetnBox?.appendChild(btn);

  btn.onclick = () => {
    // 添加任务
    workList.unshift({ ...item, count: 100 })
    schedule()
  }
})

// 执行任务
const renderComponent = (content) => {
  // 更好的观察任务调度,做的延迟效果
  let i = 10000000;
  while (i) {
    i--;
  }
  const ele = document.createElement("span");
  ele.innerText = `${content}`;
  contetnBox?.appendChild(ele)
}

// 调度器
function schedule() {
  // 获取一个任务，并弹出任务队列
  const curWork = workList.pop();
  if (curWork) {
    // 执行更新流程
    perform(curWork)
  }
}

// 更新流程
function perform(work) {
  while (work.count) {
    // count代表这个任务中有count个组件需要更新
    work.count -= 1;
    renderComponent(work.value)
  }
  // 当前任务中的组件全部更新完后，继续执行调度
  schedule()
}
