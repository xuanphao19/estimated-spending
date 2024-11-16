document.addEventListener("DOMContentLoaded", function () {
  const selectNode = (selector) => document.querySelector(selector?.trim());
  const resultDemo = selectNode(".results-demo");
  const editorElement = selectNode("#editor");
  const codeDemo = selectNode(".code-demo");
  const resultDiv = selectNode("#result");
  const editor = ace.edit(editorElement);
  editor.setFontSize(16);
  editor.setTheme("ace/theme/monokai");
  editor.session.setMode("ace/mode/javascript");
  editor.setValue(`
  function hello(message) {
    if(message) {
      return message;
    }
  }
  console.log(hello());
  console.log(hello("Hello 🌺🌺🌺 world!"));
  console.log("I-💔-F8!");`);
  const code = editor.getValue();

  const runCode = () => {
    try {
      if (resultDiv.children.length >= 1) return;
      const code = editor.getValue();
      const logs = [];
      const originalLog = console.log;
      console.log = function (...args) {
        if (args) logs.push(args.join(""));
        originalLog.apply(console, args);
      };
      eval(code);
      console.log = originalLog;

      const renderResult = (logs) => {
        resultDiv.innerHTML = `<span class="reset">Làm Lại</span>`;
        logs.forEach((log) => {
          const resultLog = document.createElement("span");
          resultLog.textContent = log === "" ? "undefined" : log;
          resultDiv.appendChild(resultLog);
          resultDemo.classList.add("current");
        });
      };

      renderResult(logs);
      resetCode();
    } catch (error) {
      resultDiv.innerHTML = `
      <span class="reset">Làm Lại Thử Thách</span>
      <span class="error">${error.message}</span>`;
      resultDemo.classList.add("current");
      resetCode();
    }
  };

  editor.on("focus", () => {});

  const copyCode = () => {
    navigator.clipboard
      .writeText(editor.getValue())
      .then(() => {})
      .catch((err) => {
        console.error("Không thể sao chép: ", err);
      });
  };

  const resetCode = () => {
    selectNode(".reset")?.addEventListener("click", () => {
      resultDemo.classList.remove("current");
      resultDiv.textContent = "";
      editor.setValue(code);
    });
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      codeDemo.requestFullscreen().catch((err) => {
        alert(`Lỗi khi chuyển sang toàn màn hình: ${err.message}`);
      });
    } else {
      document.exitFullscreen();
    }
  };

  const copied = document.getElementById("btn-copy");
  const startTransition = () => {
    copied.classList.add("active");
    copied.addEventListener("transitionend", handleTransitionEnd);
  };

  const handleTransitionEnd = (event) => {
    if (event.propertyName === "transform" || event.propertyName === "matrix") {
      copied.classList.remove("active");
      copied.removeEventListener("transitionend", handleTransitionEnd);
    }
  };

  copied.addEventListener("click", copyCode);
  copied.addEventListener("click", startTransition);
  selectNode("#run-code").addEventListener("click", runCode);
  selectNode("#btn-fullscreen").addEventListener("click", toggleFullscreen);
});
