import {
  //空闲优先级
  unstable_IdlePriority as IdlePriority,
  //低优先级
  unstable_LowPriority as LowPriority,
  //用户阻塞优先级
  unstable_UserBlockingPriority as UserBlockingPriority,
  //普通优先级
  unstable_NormalPriority as NormalPriority,
  //立刻执行的优先级
  unstable_ImmediatePriority as ImmediatePrity,
  // 当某一个preform正在被调度，但是还没被执行时，可以使用该函数进行取消
  unstable_cancelCallback as cancelCallback,
  // 用于调度preform方法
  unstable_scheduleCallback as scheduleCallback,
  // 当前帧是否用尽了, 用尽了为true，此时需要中断任务
  unstable_shouldYield as shouldYield,
  // 返回当前正在调度的任务
  unstable_getFirstCallbackNode as getFirstCallbackNode,
  // unstable_scheduleCallback的返回值
  CallbackNode
} from "scheduler"

// 本次schedule进行时，正在调度的任务的优先级
let prevPriority = undefined;

const workList = [];
const contetnBox = document.querySelector("#app");

let list = [
  {
    priority: IdlePriority,
    value: "低",
  },
  {
    priority: LowPriority,
    value: "中",
  },
  {
    priority: NormalPriority,
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

// 执行更新
const renderComponent = (content) => {
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
  // 当前正在执行的调度任务
  const cbNode = getFirstCallbackNode();
  // 获取优先级最高的任务
  const curWork = workList.sort((node1, node2) => {
    return node1.priority - node2.priority;
  })[0]
  // 如果任务不存在,即任务队列为空
  if (!curWork) {
    return;
  }
  const { priority } = curWork;
  // 此时本次的任务优先级 > 正在执行的任务优先级
  // 需要中断正在执行的任务
  if (cbNode) {
    cancelCallback(cbNode);
  }
  // 执行任务,以某个优先级来调度某个任务
  // 为什么要使用bind,因为scheduleCallback第二个参数是一个回调函数
  scheduleCallback(priority, perform.bind(null, curWork))
}

// 更新流程
function perform(work) {
  // 当前任务是否是同步执行
  // ImmediatePrity是立即执行优先级,所以需要同步执行
  const isSync = work.priority === ImmediatePrity;
  // shouldYield判断浏览器当前帧是否剩余空闲时间
  while ((isSync || !shouldYield()) && work.count) {
    work.count -= 1;
    renderComponent(work.value)
  }
  if (work.count === 0) {
    const workIndex = workList.indexOf(work)
    workList.splice(workIndex, 1)
    prevPriority = undefined;
  } else {
    prevPriority = work.priority;
  }
  //继续调度
  schedule()
}
